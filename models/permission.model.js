const {
    Sequelize,
    DataTypes
} = require('sequelize');
const db = require('../configs/db');
const Permission = db.define('Permission', {
    PermissionId: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    Name: {
        type: DataTypes.STRING,
    },
    Description: {
        type: DataTypes.STRING,
    },
}, {

    tableName: 'Permission',
    timestamps: true
});

Permission.sync();
module.exports = Permission;