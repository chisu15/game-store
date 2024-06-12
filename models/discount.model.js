const db = require('../configs/db');
const mssql = require("mssql");

module.exports.getAll = async () => {
    try {
        const record = await db.pool.request().query('select * from Discount');
        const result = record.recordset;
        return result;
    } catch (error) {
        return error.message;
    }
}

module.exports.detail = async (id) => {
    const result = await db.pool.request().query(`SELECT * FROM Discount WHERE id = '${id}'`);
    return result.recordset;
}

module.exports.create = async (data) => {
    module.exports.create = async (data) => {
        try {
            const result = await db.pool.request().query(`
                INSERT INTO Admin (
                    id,
                    code,
                    value,
                    startDate,
                    endDate)
                VALUES (
                    '${data.id}', 
                    '${data.code}',
                    '${data.value}',
                    '${data.startDate}',
                    '${data.endDate}'
                )`);
    
            if (result.rowsAffected && result.rowsAffected[0] > 0) {
                return {
                    success: true,
                    message: 'Bản ghi đã được chèn thành công.'
                };
            } else {
                return {
                    success: false,
                    message: 'Không có bản ghi nào được chèn.'
                };
            }
        } catch (error) {
            console.error('Lỗi khi chèn bản ghi:', error);
            return {
                success: false,
                message: 'Lỗi khi chèn bản ghi.'
            };
        }
    }
    
}

