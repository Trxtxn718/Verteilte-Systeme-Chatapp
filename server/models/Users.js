const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOSTNAME,
  port: 3306,
  dialect: 'mariadb',
  define: {
    timestamps: false
  }
});

class Users extends Model { }

Users.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile_img: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    },
    updated: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Users', // We need to choose the model name
  },
);

// the defined model is the class itself
console.log("Users:",Users === sequelize.models.Users); // true

module.exports = { Users, sequelize };