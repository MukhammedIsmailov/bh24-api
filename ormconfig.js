require('dotenv').config();

module.exports = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: true,
    synchronize: false,
    entities: process.env.ENV === 'prod' ? ['dist/src/modules/**/**.entity.js'] : ['src/modules/**/**.entity.ts'],
    migrations: process.env.ENV === 'prod' ? ['dist/src/migrations/*.js'] : ['src/migrations/*.ts'],
    cli: {
        migrationsDir: "src/migrations"
    }
};