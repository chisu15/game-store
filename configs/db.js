const mssql = require("mssql");

// Tải cấu hình từ biến môi trường
require('dotenv').config();
const config = {
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: {
    encrypt: true, // Mã hóa dữ liệu
    trustServerCertificate: true // Tin tưởng chứng chỉ máy chủ
  },
  pool: {
      max: 10, // Số kết nối tối đa
      min: 0, // Số kết nối tối thiểu
      idleTimeoutMillis: 30000 // Thời gian chờ tối đa
  }
}

// Tạo pool kết nối
const pool = new mssql.ConnectionPool(config);

// Xuất pool để sử dụng ở các module khác
module.exports = {
    pool
}

// Hàm kết nối đến cơ sở dữ liệu
module.exports.connect = async () => {
    try {
        await pool.connect();
        console.log("Kết nối CSDL thành công!");
     } catch (error) {
        console.log("Lỗi kết nối CSDL:", error);
     }
}

