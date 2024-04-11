// model/User.js
const createSlug = require("../helpers/createSlug");
const {
    Sequelize,
    DataTypes
} = require('sequelize');
const db = require('../configs/db');

const Game = db.define('Game', {
    // Định nghĩa các trường của bảng Users
    GameId: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    AdminId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    Name: {
        type: DataTypes.STRING,
        unique: true
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
    },
    Slug: {
        type: DataTypes.STRING,
        unique:true
    }
}, {

    tableName: 'Game',
    timestamps: false
});


Game.sync();
module.exports = Game;