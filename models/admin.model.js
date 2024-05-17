const db = require('../configs/db');
const mssql = require("mssql");

module.exports.getAll = async () => {
    try {
        const record = await db.pool.request().query('select * from Admin');
        const result = record.recordset;
        return result;
    } catch (error) {
        return error.message;
    }
};

module.exports.detail = async (id) => {
    try {
        const record = await db.pool.request().query(`
            SELECT * FROM Admin
            Where id = '${id}'
        `);
        const result = record.recordset;
        return result;
    } catch (error) {
        return error.message;
    }
}

module.exports.create = async (data) => {
    try {
        const result = await db.pool.request().query(`
            INSERT INTO Admin (
                id,
                username,
                password,
                email,
                token,
                permission)
            VALUES (
                '${data.id}', 
                '${data.username}',
                '${data.password}',
                '${data.email}',
                '${data.token}',
                '${data.permission}'
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

module.exports.update = async (id, data) => {
    try {
        let updates = [];

        if (data.username) updates.push(`user = '${data.username}'`);
        if (data.password) updates.push(`password = '${data.password}'`);
        if (data.permission) updates.push(`slug = '${data.permission}'`);

        if (updates.length === 0) {
            return {
                success: false,
                message: 'Không có trường nào được cập nhật.'
            };
        }

        const query = `
            UPDATE Admin
            SET ${updates.join(', ')}
            WHERE id = '${id}'
        `;

        const record = await db.pool.request().query(query);

        if (record.rowsAffected && record.rowsAffected[0] > 0) {
            return {
                success: true,
                message: 'Bản ghi đã được cập nhật thành công.'
            };
        } else {
            return {
                success: false,
                message: 'Không có bản ghi nào được cập nhật.'
            };
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật bản ghi:', error);
        return {
            success: false,
            message: 'Lỗi khi cập nhật bản ghi.'
        };
    }
}

module.exports.delete = async (id) => {
    try {
        const result = await db.pool.request().query(`
            DELETE FROM Admin 
            WHERE id = '${id}'
        `);
    } catch (error) {
        return error.message;
    }
}

module.exports.check = async (info, value) => {
    try {
        const request = db.pool.request();
        console.log(info, ": ",value);
        const record = await request.query(`
            SELECT * FROM Admin
            WHERE ${info} = '${value}'
        `);
        console.log(record.recordset);
        return record.recordset;
    } catch (error) {
        return error.message;
    }
}