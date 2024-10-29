const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOSTNAME,
    port: 3306,
    dialect: 'mariadb',
    define: {
        timestamps: false
    }
});

class DirectChats extends Model { }

DirectChats.init(
    {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_1: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }

        },
        user_2: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'DirectChats', // We need to choose the model name
    },
);

console.log("DirectChat:",DirectChats === sequelize.models.DirectChats); // true

module.exports = { DirectChats, sequelize };