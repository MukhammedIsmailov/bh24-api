import { IMessengerInfo } from '../../leadMessengers/DTO/IMessengerInfo';

export interface ILead {
    referId: string;
    type: string;
    messengerInfo: IMessengerInfo
}