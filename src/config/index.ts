import { Config } from './config';

export function getConfig() {
    return Config.initialConfig().getConfig();
}