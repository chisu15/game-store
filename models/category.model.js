const {
    Sequelize,
    DataTypes
} = require('sequelize');
const db = require('../configs/db');
const Admin = require("./admin.model");
const Game = require("./game.model");
const GameCategory = require("./gameCategory.model");
const Category = db.define('Category', {
    CategoryId: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    Name: {
        type: DataTypes.STRING,
        unique: true
    },
    CreatedBy: {
        type: DataTypes.STRING,
    },
    Description: {
        type: DataTypes.STRING,
    },
    Slug: {
        type: DataTypes.STRING,
        unique:true
    }
}, {

    tableName: 'Category',
    timestamps: true
});


Category.sync();
module.exports = Category;