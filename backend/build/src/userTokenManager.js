import * as jose from "jose";
export class UserTokenManager {
    constructor(dbClient, alg, privateKey, publicKey) {
        this.dbClient = dbClient;
        this.alg = alg;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }
    async createToken(user, type) {
        const alg = this.alg;
        const tokenBuilder = new jose.SignJWT({
            "fusion:app:user": user.id,
        });
        tokenBuilder
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setIssuer("fusion:app:issuer")
            .setAudience("fusion:app:user");
        if (type === UserTokenType.TEMPORARY)
            tokenBuilder.setExpirationTime("12h");
        return await tokenBuilder.sign(this.privateKey);
    }
    // typescript guidelines say to use undefined, not null https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#null-and-undefined
    async getUser(token) {
        const { payload } = await jose.jwtVerify(token, this.privateKey, {
            issuer: "fusion:app:issuer",
            audience: "fusion:app:user",
        });
        if (payload["fusion:app:user"] !== undefined &&
            typeof payload["fusion:app:user"] === "number") {
            const user = await this.dbClient.user.findUnique({
                where: { id: payload["fusion:app:user"] },
            });
            return user ?? undefined;
        }
        return undefined;
    }
}
export var UserTokenType;
(function (UserTokenType) {
    UserTokenType[UserTokenType["TEMPORARY"] = 0] = "TEMPORARY";
    UserTokenType[UserTokenType["REMEMBER_ME"] = 1] = "REMEMBER_ME";
})(UserTokenType || (UserTokenType = {}));
