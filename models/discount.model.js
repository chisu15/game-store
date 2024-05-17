const db = require('../configs/db');
const mssql = require("mssql");

module.exports.getAll = async () => {
    const result = await db.query(`SELECT * FROM Discount`);
    return result.recordset;
}

module.exports.create = async (data) => {
    const result = await db.query(`INSERT INTO Discount (name, code, value, startDate, endDate, status) VALUES (${data.name}, ${data.code}, ${data.value}, ${data.startDate}, ${data.endDate}`);
    return result.recordset;
}

