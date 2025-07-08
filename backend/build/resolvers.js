import { GraphQLError } from "graphql";
import { UserTokenType } from "./userTokenManager.js";
import { getUserByEmailOrUsername } from "./utils.js";
// Note this "Resolvers" type isn't strictly necessary because we are already
// separately type checking our queries and resolvers. However, the "Resolvers"
// generated types is useful syntax if you are defining your resolvers
// in a single file.
const mutations = {
    signup: async (_, args, context) => {
        const { username, email, password, firstName, lastName } = args;
        const userFields = {
            username,
            email,
            password: context.passwordHasher.hash(password),
            firstName,
            lastName,
        };
        if (!validUsername(args.username))
            throw new GraphQLError("Invalid username", {
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
        const data = { email, password };
        return (await context.prisma.user.update({
            where: {
                id: context.user.id,
            },
            data: data,
        }));
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
    createNote: async (_, args, context) => {
        if (!context.user)
            throw new GraphQLError("Invalid token/Invalid user", {
                extensions: {
                    code: "UNAUTHORIZED",
                },
            });
        const { title } = args;
        const data = {
            title,
            owner: { connect: { id: context.user.id } },
            collaborators: { create: { user: { connect: { id: context.user.id } } } },
            lastUpdated: new Date(),
            created: new Date(),
        };
        const note = await context.prisma.note.create({ data });
        return note;
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
    getUserNotes: async (_, args, context) => {
        if (!context.user)
            throwUnauthorized();
        /* eslint-disable @typescript-eslint/no-explicit-any */
        {
            const notes = await context.prisma.note.findMany({
                where: {
                    collaborators: {
                        some: {
                            userId: context.user?.id,
                        },
                    },
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
};
// Update docs.md when updating or moving this function
const validUsername = (username) => {
    return username.search(/\s/) < 0 && !username.includes("@");
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
const resolvers = { Mutation: mutations, Query: queries };
export default resolvers;
