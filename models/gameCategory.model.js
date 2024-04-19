const {
    Sequelize,
    DataTypes
} = require('sequelize');
const db = require('../configs/db');
const GameCategory = db.define('Category', {
    GameCategoryId: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    CategoryId: {
        type: DataTypes.STRING,
    },
    GameID: {
        type: DataTypes.STRING,
    },
}, {

    tableName: 'GameCategory',
    timestamps: true
});

GameCategory.sync();
module.exports = GameCategory;