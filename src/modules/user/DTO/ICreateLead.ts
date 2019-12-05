import { IMessengerInfo } from '../../leadMessengers/DTO/IMessengerInfo';

export interface ICreateLead {
    referId: string;
    country: string;
    messengerInfo: IMessengerInfo
}