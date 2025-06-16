import bcrypt from "bcrypt"

export const hashPassword = (plain: string) => bcrypt.hash(plain, 10);

export const verifyPassword = async (plain: string, hashed: string) => {
    return bcrypt.compare(plain, hashed);
}; 