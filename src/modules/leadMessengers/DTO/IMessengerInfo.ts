export enum Messenger {
    Telegram = 'telegram',
    Facebook = 'facebook'
}

export interface IMessengerInfo {
    messenger: Messenger;
    info: string;
    step: number;
    first_name: string;
    second_name: string;
    username: string;
}