const db = require('../configs/db');
const mssql = require("mssql");

module.exports.getAll = async () => {
    try {
        const adminRecords = await db.pool.request().query(`
            SELECT a.*, ap.permissionId
            FROM Admin a
            LEFT JOIN AdminPermission ap ON a.id = ap.adminId
        `);
        const admins = adminRecords.recordset;

        const result = {};

        admins.forEach(admin => {
            if (!result[admin.id]) {
                result[admin.id] = {
                    id: admin.id,
                    username: admin.username,
                    password: admin.password,
                    email: admin.email,
                    token: admin.token,
                    permissions: []
                };
            }
            if (admin.permissionId) {
                result[admin.id].permissions.push(admin.permissionId);
            }
        });

        const finalResult = Object.values(result);

        return finalResult;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        return { success: false, message: error.message };
    }
};


module.exports.detail = async (id) => {
    try {
        const request = db.pool.request();
        request.input('id', mssql.NVarChar, id);
        const adminRecord = await request.query(`
            SELECT a.*, ap.permissionId
            FROM Admin a
            LEFT JOIN AdminPermission ap ON a.id = ap.adminId
            WHERE a.id = @id
        `);

        const admins = adminRecord.recordset;

        if (admins.length === 0) {
            return { success: false, message: 'Không tìm thấy quản trị viên.' };
        }

        const adminDetail = {
            id: admins[0].id,
            username: admins[0].username,
            password: admins[0].password,
            email: admins[0].email,
            token: admins[0].token,
            permissions: []
        };

        admins.forEach(admin => {
            if (admin.permissionId) {
                adminDetail.permissions.push(admin.permissionId);
            }
        });

        return adminDetail;
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết quản trị viên:', error);
        return { success: false, message: error.message };
    }
};

module.exports.create = async (data) => {
    const transaction = new mssql.Transaction(db.pool);
    try {
        await transaction.begin();

        const request = new mssql.Request(transaction);

        request.input('id', mssql.NVarChar, data.id);
        request.input('username', mssql.NVarChar, data.username);
        request.input('password', mssql.NVarChar, data.password);
        request.input('email', mssql.NVarChar, data.email);
        request.input('token', mssql.NVarChar, data.token);

        const adminResult = await request.query(`
            INSERT INTO Admin (id, username, password, email, token)
            VALUES (@id, @username, @password, @email, @token)
        `);

        if (adminResult.rowsAffected && adminResult.rowsAffected[0] > 0) {
            for (const permission of data.permissions) {
                const permissionRequest = new mssql.Request(transaction);
                permissionRequest.input('adminId', mssql.NVarChar, data.id);
                permissionRequest.input('permissionId', mssql.NVarChar, permission);

                await permissionRequest.query(`
                    INSERT INTO AdminPermission (adminId, permissionId)
                    VALUES (@adminId, @permissionId)
                `);
            }

            await transaction.commit();
            return { success: true, message: 'Bản ghi đã được chèn thành công.' };
        } else {
            await transaction.rollback();
            return { success: false, message: 'Không có bản ghi nào được chèn.' };
        }
    } catch (error) {
        await transaction.rollback();
        console.error('Lỗi khi chèn bản ghi:', error);
        return { success: false, message: 'Lỗi khi chèn bản ghi.' };
    }
};


module.exports.update = async (id, data) => {
    const transaction = new mssql.Transaction(db.pool);
    try {
        await transaction.begin();

        let updates = [];
        const request = new mssql.Request(transaction);

        request.input('id', mssql.NVarChar, id);
        if (data.username) { updates.push(`username = @username`); request.input('username', mssql.NVarChar, data.username); }
        if (data.password) { updates.push(`password = @password`); request.input('password', mssql.NVarChar, data.password); }
        if (data.email) { updates.push(`email = @email`); request.input('email', mssql.NVarChar, data.email); }
        if (data.token) { updates.push(`token = @token`); request.input('token', mssql.NVarChar, data.token); }

        if (updates.length === 0) {
            return {
                success: false,
                message: 'Không có trường nào được cập nhật.'
            };
        }

        const query = `
            UPDATE Admin
            SET ${updates.join(', ')}
            WHERE id = @id
        `;

        const record = await request.query(query);

        if (record.rowsAffected && record.rowsAffected[0] > 0) {
            // Xóa các quyền cũ và thêm các quyền mới
            await request.query(`
                DELETE FROM AdminPermission WHERE adminId = @id
            `);

            if (data.permissions && data.permissions.length > 0) {
                for (const permission of data.permissions) {
                    const permissionRequest = new mssql.Request(transaction);
                    permissionRequest.input('adminId', mssql.NVarChar, id);
                    permissionRequest.input('permissionId', mssql.NVarChar, permission);

                    await permissionRequest.query(`
                        INSERT INTO AdminPermission (adminId, permissionId)
                        VALUES (@adminId, @permissionId)
                    `);
                }
            }

            await transaction.commit();
            return {
                success: true,
                message: 'Bản ghi đã được cập nhật thành công.'
            };
        } else {
            await transaction.rollback();
            return {
                success: false,
                message: 'Không có bản ghi nào được cập nhật.'
            };
        }
    } catch (error) {
        await transaction.rollback();
        console.error('Lỗi khi cập nhật bản ghi:', error);
        return {
            success: false,
            message: 'Lỗi khi cập nhật bản ghi.'
        };
    }
};

module.exports.delete = async (id) => {
    const transaction = new mssql.Transaction(db.pool);
    try {
        await transaction.begin();

        const request = new mssql.Request(transaction);
        request.input('id', mssql.NVarChar, id);

        await request.query(`
            DELETE FROM AdminPermission 
            WHERE adminId = @id
        `);

        const result = await request.query(`
            DELETE FROM Admin 
            WHERE id = @id
        `);

        await transaction.commit();
        return {
            success: true,
            message: 'Bản ghi đã được xóa thành công.'
        };
    } catch (error) {
        await transaction.rollback();
        console.error('Lỗi khi xóa bản ghi:', error);
        return {
            success: false,
            message: error.message
        };
    }
};

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