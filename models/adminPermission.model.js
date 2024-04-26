const {
    Sequelize,
    DataTypes
} = require('sequelize');
const db = require('../configs/db');
const AdminPermission = db.define('AdminPermission', {
    PermissionId: {
        type: DataTypes.STRING,
    },
    AdminId: {
        type: DataTypes.STRING,
    },
}, {

    tableName: 'AdminPermission',
    timestamps: false
});

AdminPermission.sync();
module.exports = AdminPermission;