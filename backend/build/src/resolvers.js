import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { UserTokenType } from "./userTokenManager.js";
import { getUserByEmailOrUsername, stream2buffer } from "./utils.js";
const pubsub = new PubSub();
const NOTE_UPDATED = "NOTE_UPDATED";
const subscriptions = {
    noteUpdated: {
        subscribe: (_, { noteId }, context, info) => {
            return new Promise((resolve) => {
                const iterator = pubsub.asyncIterator(`${NOTE_UPDATED}_${noteId}`);
                const asyncIterable = {
                    [Symbol.asyncIterator]: () => iterator,
                };
                resolve(asyncIterable);
            });
        },
    },
};
// Note this "Resolvers" type isn't strictly necessary because we are already
// separately type checking our queries and resolvers. However, the "Resolvers"
// generated types is useful syntax if you are defining your resolvers
// in a single file.
const mutations = {
    signup: async (_, args, context) => {
        const { username, email, password, firstName, lastName, avatar } = args;
        const userFields = {
            username,
            email,
            password: context.passwordHasher.hash(password),
            firstName,
            lastName,
            avatar,
        };
        if (!validUsername(args.username))
            throw new GraphQLError("Invalid username", {
                extensions: {
                    code: "BAD_REQUEST",
                },
            });
        if (!validEmail(email))
            throw new GraphQLError("Invalid email", {
                extensions: {
                    code: "BAD_REQUEST",
                },
            });
        const user = await context.prisma.user
            .create({
            data: userFields,
        })
            .catch(() => {
            return undefined;
        });
        if (!user)
            throw new GraphQLError("Error creating user", {
                extensions: {
                    code: "INTERNAL_SERVER_ERROR",
                },
            });
        const { createReadStream } = await avatar;
        const imageBuffer = await stream2buffer(createReadStream());
        context.userAvatarManager.saveAvatar(user.username, imageBuffer);
        return {
            token: await context.userTokenManager.createToken(user, UserTokenType.TEMPORARY),
        };
    },
    createToken: async (_, args, context) => {
        const user = await getUserByEmailOrUsername(context.prisma, args.emailOrUsername);
        const type = args.remember
            ? UserTokenType.REMEMBER_ME
            : UserTokenType.TEMPORARY;
        let token;
        if (!user)
            throw new GraphQLError("Invalid/no user", {
                extensions: {
                    code: "UNAUTHORIZED",
                },
            });
        if (!context.passwordHasher.verify(args.password, user?.password))
            throw new GraphQLError("Incorrect password", {
                extensions: {
                    code: "FORBIDDEN",
                },
            });
        token = await context.userTokenManager.createToken(user, type);
        return {
            token: token,
            user: user ?? null,
        };
    },
    updateUser: async (_, args, context) => {
        if (!context.user)
            throwUnauthorized();
        // we could use args directly but this lets us rename the fields in the db without doing so in the API and also give us more control over the fields
        const { username, firstName, lastName } = args;
        const data = { username, firstName, lastName };
        if (username != undefined && !validUsername(username))
            throw new GraphQLError("Invalid username", {
                extensions: {
                    code: "BAD_REQUEST",
                },
            });
        return (await context.prisma.user.update({
            where: {
                id: context.user.id,
            },
            data: data,
        }));
    },
    updateUserSecure: async (_, args, context) => {
        if (!context.user)
            throwUnauthorized();
        if (!context.passwordHasher.verify(args.originalPassword, context.user.password))
            throwBadPassword();
        const { email, password } = args;
        if (email != undefined && !validEmail(email))
            throw new GraphQLError("Invalid email", {
                extensions: {
                    code: "BAD_REQUEST",
                },
            });
        /* eslint-disable @typescript-eslint/no-explicit-any */
        {
            const data = {};
            if (email)
                data.email = email;
            if (password)
                data.password = context.passwordHasher.hash(password);
            return (await context.prisma.user.update({
                where: {
                    id: context.user.id,
                },
                data: data,
            }));
        }
    },
    deleteUser: async (_, args, context) => {
        if (!context.user)
            throwUnauthorized();
        if (!context.passwordHasher.verify(args.password, context.user.password))
            throwBadPassword();
        await context.prisma.user.delete({
            where: { id: context.user.id },
        });
        return true;
    },
    deleteNote: async (_, args, context) => {
        if (!context.user)
            throwUnauthorized();
        const { id } = args;
        const note = await context.prisma.note.findUnique({
            where: { id: parseInt(id) },
        });
        if (!note) {
            throwNoteNotFound();
        }
        if (note.ownerId !== context.user.id) {
            throwUnauthorized();
        }
        await context.prisma.note.delete({
            where: {
                id: parseInt(id),
            },
        });
        return true;
    },
    createCategory: async (_, args, context) => {
        const { name } = args;
        const userId = context.user?.id;
        const newCategory = await context.prisma.category.create({
            data: {
                name,
                user: {
                    connect: { id: userId },
                },
            },
        });
        const notes = await context.prisma.note.findMany({
            where: { categoryId: newCategory.id },
        });
        const cat = newCategory;
        cat.notes = notes;
        return cat;
    },
    updateCategory: async (_, args, context) => {
        const { id, name } = args;
        const updatedCategory = await context.prisma.category.update({
            where: { id: parseInt(id) },
            data: { name },
        });
        const notes = await context.prisma.note.findMany({
            where: { categoryId: updatedCategory.id },
        });
        const cat = updatedCategory;
        cat.notes = notes;
        return cat;
    },
    deleteCategory: async (_, args, context) => {
        const { id } = args;
        await context.prisma.category.delete({
            where: { id: parseInt(id) },
        });
        return true;
    },
    createNote: async (_, args, context) => {
        if (!context.user)
            throwUnauthorized();
        const { title } = args;
        const data = {
            title,
            owner: { connect: { id: context.user.id } },
            lastUpdated: new Date(),
            created: new Date(),
        };
        const note = await context.prisma.note.create({ data });
        return note;
    },
    updateNote: async (_, args, context) => {
        const noteId = parseInt(args.id);
        if (args.collaborators) {
            const collaboratorIds = args.collaborators.map((v) => parseInt(v));
            await context.prisma.noteAccess.deleteMany({
                where: { id: { notIn: collaboratorIds } },
            });
            await context.prisma.noteAccess.createMany({
                data: collaboratorIds.map((userId) => {
                    return { noteId, userId };
                }),
                skipDuplicates: true,
            });
        }
        /* eslint-disable @typescript-eslint/no-explicit-any */
        {
            const data = {};
            if (args.title) {
                data.title = args.title;
            }
            if (args.content) {
                data.content = args.content;
            }
            const note = (await context.prisma.note.update({
                where: { id: noteId },
                data,
            }));
            if (args.title || args.content) {
                console.log({ content: note.content, title: note.title });
                pubsub.publish(`${NOTE_UPDATED}_${noteId}`, {
                    noteUpdated: { content: note.content, title: note.title },
                });
            }
            return note;
        }
    },
};
const queries = {
    getCurrentUser: async (_, args, context) => {
        if (!context.user)
            throwUnauthorized();
        return context.user;
    },
    getUserByEmailOrUsername: async (_, args, context) => {
        if (!context.user)
            throwUnauthorized();
        const user = await getUserByEmailOrUsername(context.prisma, args.emailOrUsername);
        if (!user)
            throwBadUser();
        return user;
    },
    getUserById: async (_, args, context) => {
        if (!context.user)
            throwUnauthorized();
        const user = await context.prisma.user.findUnique({
            where: { id: parseInt(args.id) },
        });
        if (!user)
            throwBadUser();
        return user;
    },
    getNote: async (_, args, context) => {
        if (!context.user)
            throwUnauthorized();
        const noteId = parseInt(args.id); // <-- Convert args.id to a number
        const note = await context.prisma.note.findUnique({
            where: { id: noteId },
            select: {
                id: true,
                content: true,
                title: true,
                lastUpdated: true,
                created: true,
                owner: true,
                category: true,
                collaborators: { select: { user: true } },
            },
        });
        if (!note) {
            throwNoteNotFound();
        }
        const collaborators = [];
        for (const collaborator of note.collaborators) {
            collaborators.push(collaborator.user);
        }
        note.collaborators = collaborators;
        return note;
    },
    getUserNotes: async (_, args, context) => {
        if (!context.user)
            throwUnauthorized();
        /* eslint-disable @typescript-eslint/no-explicit-any */
        {
            const notes = await context.prisma.note.findMany({
                where: {
                    OR: [
                        { ownerId: context.user.id },
                        {
                            collaborators: {
                                some: {
                                    userId: context.user.id,
                                },
                            },
                        },
                    ],
                },
                select: {
                    id: true,
                    content: true,
                    title: true,
                    lastUpdated: true,
                    created: true,
                    owner: true,
                    category: true,
                    collaborators: { select: { user: true } },
                },
            });
            for (const note of notes) {
                const collaborators = [];
                for (const collaborator of note.collaborators) {
                    collaborators.push(collaborator.user);
                }
                note.collaborators = collaborators;
            }
            return notes;
        }
    },
    getUserCategories: async (_, args, context) => {
        if (!context.user)
            throwUnauthorized();
        return context.prisma.category.findMany({
            where: { userId: context.user.id },
        });
    },
};
// Update docs.md when updating or moving this function
const validUsername = (username) => {
    return (username.length > 0 && username.search(/\s/) < 0 && !username.includes("@"));
};
const validEmail = (email) => {
    return email.length > 0;
};
const throwUnauthorized = () => {
    throw new GraphQLError("Invalid token/Invalid user", {
        extensions: {
            code: "UNAUTHORIZED",
        },
    });
};
const throwBadUser = () => {
    throw new GraphQLError("Invalid/no user", {
        extensions: {
            code: "UNAUTHORIZED",
        },
    });
};
const throwBadPassword = () => {
    throw new GraphQLError("Incorrect password", {
        extensions: {
            code: "FORBIDDEN",
        },
    });
};
const throwNoteNotFound = () => {
    throw new GraphQLError("Note not found", {
        extensions: {
            code: "NOT_FOUND",
        },
    });
};
const resolvers = {
    Mutation: mutations,
    Query: queries,
    Subscription: subscriptions,
};
export default resolvers;
