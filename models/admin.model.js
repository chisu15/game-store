const {
    Sequelize,
    DataTypes
} = require('sequelize');
const db = require('../configs/db');
const Game = require("./game.model");
const Admin = db.define('Admin', {
    AdminId: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    Username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Permissions: {
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
}, {

    tableName: 'Admin',
    timestamps: false
});
// Admin.associate = function(model) {
//     Admin.hasMany(db.define("Game"));
// }

Admin.sync();
module.exports = Admin;