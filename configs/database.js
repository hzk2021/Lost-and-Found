const Sequelize = require('sequelize');

const dbConfig = {
    host: 'it3122-db-instance.chgphrc7nwu8.us-east-1.rds.amazonaws.com',
    database: 'LostnFound',
    username: 'admin',
    password: 'password',
    port: 3306
}

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'mariadb',
    operatorsAliases: false,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = {dbConfig, sequelize};