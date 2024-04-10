// model/User.js

const {
    Sequelize,
    DataTypes
} = require('sequelize');
const db = require('../configs/db');

const Game = db.define('Game', {
    // Định nghĩa các trường của bảng Users
    GameId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    AdminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Name: {
        type: DataTypes.STRING,
    },
    Price: {
        type: DataTypes.DECIMAL(6, 2),
    },
    Discount: {
        type: DataTypes.DECIMAL(3, 2),
    },
    Description: {
        type: DataTypes.STRING,
    },
    Requirement: {
        type: DataTypes.STRING,
    },
    Images: {
        type: DataTypes.STRING,
    },
    DownloadLink: {
        type: DataTypes.STRING,
    },
    CreatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    UpdatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {

    tableName: 'Game',
    timestamps: true
});

module.exports = Game;