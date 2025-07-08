export async function getUserByEmailOrUsername(prisma, emailOrUsername) {
    return ((await prisma.user.findFirst({
        where: {
            OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
        },
    })) ?? undefined);
}
