
const Sequelize = require('sequelize');
require('dotenv').config();


// Kết nối đến cơ sở dữ liệu SQL Server
const sequelize = new Sequelize(process.env.SQL_DATABASE, process.env.SQL_USERNAME, process.env.SQL_PASSWORD, {
    host: process.env.SQL_SERVER,
    dialect: "mssql",
});

sequelize.authenticate()
.then(() => {
  console.log('Connected to SQL Server');
})
.catch(err => {
  console.error('Error connecting to SQL Server:', err);
});

module.exports = sequelize;
