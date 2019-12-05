import { IMessengerInfo } from '../../leadMessengers/DTO/IMessengerInfo';

export interface ICreateLead {
    referId: string;
    type: string;
    messengerInfo: IMessengerInfo
}