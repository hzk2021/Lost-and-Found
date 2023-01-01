const DB = require('./database');
const mariaDB = require('mariadb');

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
        await conn.query('CREATE DATABASE LostnFound')
            .then((res) => {
                DB.sequelize.authenticate();
                console.log("Database connected");
            });

    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }

}

module.exports = {InitSchema};