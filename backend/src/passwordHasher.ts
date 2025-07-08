import bcrypt from "bcrypt";

export class PasswordHasher {
  readonly salt;

  constructor(saltRounds: number) {
    this.salt = bcrypt.genSaltSync(saltRounds);
  }

  hash(plaintextPassword: string): string {
    return bcrypt.hashSync(plaintextPassword, this.salt);
  }

  verify(
    plaintextPassword: string | undefined,
    hashedPassword: string | undefined
  ): boolean {
    if (plaintextPassword === undefined || hashedPassword === undefined)
      return false;

    return bcrypt.compareSync(plaintextPassword, hashedPassword);
  }
}
