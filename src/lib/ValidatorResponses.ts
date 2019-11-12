import { Error } from './error';

export interface IBaseValidatorResponse {
    errorStatus: boolean;
    error: Error;
}

export interface IValidatorResponse {
    field: string;
    error: Error;
}