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
        allowNull: true,
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
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    UpdatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {

    tableName: 'Game',
    timestamps: false
});

module.exports = Game;