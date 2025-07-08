import { PrismaClient, User } from "@prisma/client";
import * as jose from "jose";

export class UserTokenManager {
  readonly dbClient: PrismaClient;
  readonly privateKey;
  readonly publicKey;
  readonly alg;

  constructor(
    dbClient: PrismaClient,
    alg: string,
    privateKey: jose.KeyLike,
    publicKey: jose.KeyLike
  ) {
    this.dbClient = dbClient;
    this.alg = alg;
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }

  async createToken(user: User, type: UserTokenType): Promise<string> {
    const alg = this.alg;

    const tokenBuilder = new jose.SignJWT({
      "fusion:app:user": user.id,
    });
    tokenBuilder
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer("fusion:app:issuer")
      .setAudience("fusion:app:user");

    if (type === UserTokenType.TEMPORARY) tokenBuilder.setExpirationTime("12h");

    return await tokenBuilder.sign(this.privateKey);
  }
  // typescript guidelines say to use undefined, not null https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#null-and-undefined
  async getUser(token: string): Promise<User | undefined> {
    const { payload } = await jose.jwtVerify(token, this.privateKey, {
      issuer: "fusion:app:issuer",
      audience: "fusion:app:user",
    });

    if (
      payload["fusion:app:user"] !== undefined &&
      typeof payload["fusion:app:user"] === "number"
    ) {
      const user = await this.dbClient.user.findUnique({
        where: { id: payload["fusion:app:user"] },
      });
      return user ?? undefined;
    }

    return undefined;
  }
}

export enum UserTokenType {
  TEMPORARY,
  REMEMBER_ME,
}
