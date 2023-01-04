const {Sequelize, DataTypes, Model} = require('sequelize');
const Database = require('../configs/database')

class Item extends Model {}

Item.init( {
    ItemID: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    Name: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    Description: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    ImageS3Url: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    DateReported: {
        type: DataTypes.DATE(),
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize: Database.sequelize,
    modelName: 'Item'
}
);

Item.sync();

module.exports = {Item};