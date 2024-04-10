// const mssql = require("mssql");
const Sequelize = require('sequelize');
require('dotenv').config();
// var config ={
//     server: process.env.SQL_SERVER,
//     user: process.env.SQL_USERNAME,
//     password: process.env.SQL_PASSWORD,
//     database: process.env.SQL_DATABASE,
//     driver: process.env.SQL_DRIVER,
//     options: {
//         encrypt: false,
//         enableArithAbort: false
//     },
//     connectionTimeout: 300000,
//     requestTimeout: 300000,
// }



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



// const pool = new mssql.ConnectionPool(config)

// module.exports = {
//     pool
// }
// module.exports.connect = async () => {
//     try {
//         await pool.connect();
//         console.log("Connect DB Success!");
//      } catch (error) {
//         console.log(error);
//      }
// }