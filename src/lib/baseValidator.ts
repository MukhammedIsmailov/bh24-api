import { Error } from './error';
import { IBaseValidatorResponse } from './ValidatorResponses';

export function isEmpty (field) {
    const errorStatus = !field || !field.length;
    return <IBaseValidatorResponse> { errorStatus, error: Error.emptyField };
}

