import { Config } from "./Config";

export function getConfig() {
    return Config.initialConfig().getConfig();
}