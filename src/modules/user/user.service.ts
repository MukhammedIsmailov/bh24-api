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

export function getSubquery(subqueriesFilters) {
    let index = 0;
    let subquery = ' AND (';
    subqueriesFilters.forEach((subqueryFilter) => {
        if(!!subqueryFilter) {
            if(index !== 0) {
                subquery += ' OR ';
            }
            subquery += subqueryFilter;
            index ++;
        }
    });
    subquery += ')';

    return subquery;
}