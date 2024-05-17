"use strict";

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    DataTypes = _require.DataTypes;

var db = require('../configs/db');

var AdminPermission = db.define('AdminPermission', {
  PermissionId: {
    type: DataTypes.STRING
  },
  AdminId: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'AdminPermission',
  timestamps: false
});
AdminPermission.sync();
module.exports = AdminPermission;