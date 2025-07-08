export async function getUserByEmailOrUsername(prisma, emailOrUsername) {
    return ((await prisma.user.findFirst({
        where: {
            OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
        },
    })) ?? undefined);
}
// Code from stackoverflow. https://stackoverflow.com/a/67729663
export async function stream2buffer(stream) {
    return new Promise((resolve, reject) => {
        const _buf = Array();
        stream.on("data", (chunk) => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", (err) => reject(`error converting stream - ${err}`));
    });
}
