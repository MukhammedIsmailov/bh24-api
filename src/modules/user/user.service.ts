import { hashSync, compareSync } from 'bcrypt';
import { lookup } from 'geoip-lite';

const saltRounds: number = 10;

export function getEncryptedPassword(password): string {
    return hashSync(password, saltRounds);
}

export function comparePasswords(encryptedPassword, inputPassword): boolean {
    return compareSync(inputPassword, encryptedPassword);
}

export function getCountryCode(ip: string) : string {
    return lookup(ip).country.toLowerCase();
}