import bcrypt from "bcrypt";
export class PasswordHasher {
    constructor(saltRounds) {
        this.salt = bcrypt.genSaltSync(saltRounds);
    }
    hash(plaintextPassword) {
        return bcrypt.hashSync(plaintextPassword, this.salt);
    }
    verify(plaintextPassword, hashedPassword) {
        if (plaintextPassword === undefined || hashedPassword === undefined)
            return false;
        return bcrypt.compareSync(plaintextPassword, hashedPassword);
    }
}
