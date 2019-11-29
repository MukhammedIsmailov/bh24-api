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
    const fieldsForValidation = ['firstName', 'secondName', 'leaderId'];

    for (const key of fieldsForValidation) {
        const result = isEmpty(inputData[key]);
        if(result.errorStatus) {
            wrongFields.push({ field: key, error: result.error });
        }
    }

    const checkLeader = await isValidLeader(inputData.leaderId, repository);

    if (checkLeader.errorStatus) {
        wrongFields.push({ field: 'leaderId', error: checkLeader.error});
    }

    return wrongFields;
}

export async function updateValidator(id: number, inputData: IUpdatePartner, repository: Repository<PartnerEntity>) {
    const wrongFields: IValidatorResponse[] = [];
    const fieldsForValidation = ['firstName', 'secondName', 'referId', 'iconUrl', 'phoneNumber', 'email', 'login'];

    for (const key of fieldsForValidation) {
        const result = isEmpty(inputData[key]);
        if(result.errorStatus) {
            wrongFields.push({ field: key, error: result.error });
        }
    }

    const checkLogin = await isUniqueLogin(id, inputData.login, repository);
    if (checkLogin.errorStatus) {
        wrongFields.push({ field: 'login', error: checkLogin.error});
    }

    const checkReferId = await isUniqueReferId(id, inputData.referId, repository);
    if (checkReferId.errorStatus) {
        wrongFields.push({ field: 'referId', error: checkReferId.error });
    }

    const checkEmail = await isUniqueEmail(id, inputData.email, repository);
    if (checkEmail.errorStatus) {
        wrongFields.push({ field: 'email', error: checkEmail.error });
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

async function isUniqueLogin(id: number, login: string, repository: Repository<PartnerEntity>) {
    const count = await repository.count({ login: login, id: Not(Equal(id)) });
    const errorStatus = count > 0;

    return <IBaseValidatorResponse> { errorStatus, error: Error.notUnique };
}

async function isUniqueEmail(id: number, email: string, repository: Repository<PartnerEntity>) {
    const count = await repository.count({ email: email, id: Not(Equal(id)) });
    const errorStatus = count > 0;

    return <IBaseValidatorResponse> { errorStatus, error: Error.notUnique };
}

async function isUniqueReferId(id: number, referId: string, repository: Repository<PartnerEntity>) {
    const count = await repository.count({ referId: referId, id: Not(Equal(id)) });
    const errorStatus = count > 0;

    return <IBaseValidatorResponse> { errorStatus, error: Error.notUnique };
}

async function isValidLeader(id: number, repository: Repository<PartnerEntity>) {
    const partner = await repository.findOne({ id });
    return <IBaseValidatorResponse> { errorStatus: !partner, error: Error.notExist };
}
