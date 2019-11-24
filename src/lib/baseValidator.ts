import { Error } from './error';
import { IBaseValidatorResponse } from './ValidatorResponses';

export function isEmpty (field) {
    const errorStatus = typeof field === 'string' ? !field || !field.length : !field;
    return <IBaseValidatorResponse> { errorStatus, error: Error.emptyField };
}

