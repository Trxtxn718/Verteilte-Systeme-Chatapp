const { Sequelize, DataTypes, Model } = require('sequelize');
const { DirectChats } = require('./DirectChats');
const { Users } = require('./Users');
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOSTNAME,
    port: 3306,
    dialect: 'mariadb',
    define: {
        timestamps: false
    }
});

class Messages extends Model { }

Messages.init(
    {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }

        },
        chat_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'DirectChats',
                key: 'id'
            }
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Messages', // We need to choose the model name
    },
);

console.log(Messages === sequelize.models.Messages); // true

module.exports = { Messages, sequelize };