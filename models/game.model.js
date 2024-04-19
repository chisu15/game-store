const {
    Sequelize,
    DataTypes
} = require('sequelize');
const db = require('../configs/db');
const Admin = require("./admin.model");
const Category = require('./category.model');
const GameCategory = require("./gameCategory.model");
const Game = db.define('Game', {
    GameId: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    CreatedBy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Name: {
        type: DataTypes.STRING,
        unique: true
    },
    CategoryId: {
        type:DataTypes.STRING,
        allowNull: true,
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
        allowNull: true
    },
    DownloadLink: {
        type: DataTypes.STRING,
        allowNull: true
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