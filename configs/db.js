const mssql = require("mssql");


require('dotenv').config();
const config = {
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: {
    encrypt: true, 
    trustServerCertificate: true 
  },
  pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
  }
}

const pool = new mssql.ConnectionPool(config)

module.exports = {
    pool
}
module.exports.connect = async () => {
    try {
        await pool.connect();
        console.log("Connect DB Success!");
     } catch (error) {
        console.log(error);
     }
}


// Kết nối đến cơ sở dữ liệu SQL Server
// const sequelize = new Sequelize(process.env.SQL_DATABASE, process.env.SQL_USERNAME, process.env.SQL_PASSWORD, {
//     host: process.env.SQL_SERVER,
//     dialect: "mssql",
// });
// sequelize.authenticate()
// .then(() => {
//   console.log('Connected to SQL Server');
// })
// .catch(err => {
//   console.error('Error connecting to SQL Server:', err);
// });

// module.exports = sequelize;







// const Sequelize = require('sequelize');
// require('dotenv').config();


// // Kết nối đến cơ sở dữ liệu SQL Server
// const sequelize = new Sequelize(process.env.SQL_DATABASE, process.env.SQL_USERNAME, process.env.SQL_PASSWORD, {
//     host: process.env.SQL_SERVER,
//     dialect: "mssql",
// });

// sequelize.authenticate()
// .then(() => {
//   console.log('Connected to SQL Server');
// })
// .catch(err => {
//   console.error('Error connecting to SQL Server:', err);
// });

// module.exports = sequelize;
