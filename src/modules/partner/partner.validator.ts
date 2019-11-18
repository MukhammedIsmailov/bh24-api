import { Equal, Not, Repository } from 'typeorm';

import { ICreatePartner } from './DTO/ICreatePartner';
import { IUpdatePartner } from './DTO/IUpdatePartner';
import { IAuthorizePartner } from './DTO/IAuthorizePartner';
import { isEmpty } from '../../lib/baseValidator';
import { IBaseValidatorResponse, IValidatorResponse } from '../../lib/ValidatorResponses';
import { PartnerEntity } from './partner.entity';
import { Error } from '../../lib/error';

export async function createValidator(inputData: ICreatePartner, repository: Repository<PartnerEntity>) {
    const wrongFields: IValidatorResponse[] = [];
    const fieldsForValidation = ['firstName', 'secondName', 'login'];

    for (const key of fieldsForValidation) {
        const result = isEmpty(inputData[key]);
        if(result.errorStatus) {
            wrongFields.push({ field: key, error: result.error });
        }
    }
    const checkLogin = await isUniqueLogin(inputData.login, repository);

    if (checkLogin.errorStatus) {
        wrongFields.push({ field: 'login', error: checkLogin.error})
    }

    return wrongFields;
}

export async function updateValidator(id: number, inputData: IUpdatePartner, repository: Repository<PartnerEntity>) {
    const wrongFields: IValidatorResponse[] = [];
    const fieldsForValidation = ['firstName', 'secondName', 'referId', 'iconUrl', 'phoneNumber', 'email', 'password'];

    for (const key of fieldsForValidation) {
        const result = isEmpty(inputData[key]);
        if(result.errorStatus) {
            wrongFields.push({ field: key, error: result.error });
        }
    }

    const checkReferId = await isUniqueReferId(id, inputData.referId, repository);
    if (checkReferId.errorStatus) {
        wrongFields.push({ field: 'login', error: checkReferId.error });
    }

    const checkPassword = isValidPassword(inputData.password);
    if(checkPassword.errorStatus) {
        wrongFields.push({ field: 'password', error: checkPassword.error });
    }

    return wrongFields;
}

export function loginValidator(inputData: IAuthorizePartner) {
    const wrongFields: IValidatorResponse[] = [];
    const fieldsForValidation = ['login', 'password'];

    for (const key of fieldsForValidation) {
        const result = isEmpty(inputData[key]);
        if(result.errorStatus) {
            wrongFields.push({ field: key, error: result.error });
        }
    }

    return wrongFields;
}

async function isUniqueLogin(login: string, repository: Repository<PartnerEntity>) {
    const count = await repository.count({ login: login });
    const errorStatus = count > 0;

    return <IBaseValidatorResponse> { errorStatus, error: Error.notUnique };
}

async function isUniqueReferId(id: number, referId: string, repository: Repository<PartnerEntity>) {
    const count = await repository.count({ referId: referId, id: Not(Equal(id)) });
    const errorStatus = count > 0;

    return <IBaseValidatorResponse> { errorStatus, error: Error.notUnique };
}

function isValidPassword(password) {
    const regexp = new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}');
    const errorStatus = password.search(regexp) !== 0;
    return <IBaseValidatorResponse> { errorStatus, error: Error.wrong };
}
