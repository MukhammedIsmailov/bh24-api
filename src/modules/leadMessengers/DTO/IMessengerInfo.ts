export enum Messenger {
    Telegram = 'telegram',
    Facebook = 'facebook',
    Viber = 'viber'
}

export interface IMessengerInfo {
    messenger: Messenger;
    info: string;
}