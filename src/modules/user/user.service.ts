import { hashSync, compareSync } from 'bcrypt';

const saltRounds: number = 10;

export function getEncryptedPassword(password): string {
    return hashSync(password, saltRounds);
}

export function comparePasswords(encryptedPassword, inputPassword): boolean {
    return compareSync(inputPassword, encryptedPassword);
}