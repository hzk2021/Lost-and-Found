const DB = require('./database');
const mariaDB = require('mariadb');
const ItemModel = require('../models/Item');

const InitSchema = async function(drop) {
    const pool = mariaDB.createPool({
        host: DB.dbConfig.host,
        user: DB.dbConfig.username,
        password: DB.dbConfig.password,
        connectionLimit: 5
    });

    let conn;

    try {
        conn = await pool.getConnection();
        await conn.query('CREATE DATABASE IF NOT EXISTS LostnFound;')
            .then(() => {
                DB.sequelize.authenticate();
                ItemModel.Item.sync();
                DB.sequelize.sync({force: drop})
                console.log("Database connected");
            });

    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }

}

module.exports = {InitSchema};