import { config } from 'dotenv';

export class Config {
    private static instance: Config;

    private constructor() {
        config();
    }
    static initialConfig() {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }

    getConfig() {
        return {
            dbHost: process.env.DB_HOST,
            dbPort: process.env.DB_PORT,
            dbName: process.env.DB_NAME,
            dbUser: process.env.DB_USER,
            dbPass: process.env.DB_PASS,
            appPort: process.env.APP_PORT,
            jwtSecretKey: process.env.JWT_SECRET_KEY,
            jwtTokenExpireInMinutes: Number.parseInt(process.env.JWT_TOKEN_EXPIRE_IN_MINUTES),
        }
    }
}