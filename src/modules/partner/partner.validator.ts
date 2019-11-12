import {Repository} from 'typeorm';

import {ICreatePartner} from './DTO/ICreatePartner';
import {isEmpty} from '../../lib/baseValidator';
import {IBaseValidatorResponse, IValidatorResponse} from '../../lib/ValidatorResponses';
import {PartnerEntity} from './partner.entity';
import {Error} from '../../lib/error';

export async function createValidator(inputData: ICreatePartner, repository: Repository<PartnerEntity>) {
    const wrongFields: IValidatorResponse[] = [];
    for (const key in inputData) {
        const result = isEmpty(inputData[key]);
        if(result.errorStatus) {
            wrongFields.push({ field: key, error: result.error });
        }
    }
    const checkLogin = await isUniqueLogin(inputData.login, repository);

    if (checkLogin.errorStatus) {
        wrongFields.push({ field: 'login', error: Error.notUnique })
    }
    return wrongFields;
}

async function isUniqueLogin(login: string, repository: Repository<PartnerEntity>) {
    const count = await repository.count({ login: login });
    const errorStatus = count > 0;

    return <IBaseValidatorResponse> { errorStatus, error: Error.notUnique };
}
