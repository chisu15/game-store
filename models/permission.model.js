const db = require('../configs/db');


module.exports.getAll = async () => {
    try {
        const record = await db.pool.request().query('select * from Permission');
        const result = record.recordset;
        return result;
    } catch (error) {
        return error.message;
    }
};

module.exports.detail = async (id)=> {
    try {
        const record = await db.pool.request().query(`
            SELECT * FROM Permission
            Where PermissionId = '${id}'
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
            INSERT INTO Permission (PermissionId, Title, Description, Slug)
            VALUES (
                '${data.PermissionId}', 
                '${data.Title}',
                '${data.Description}',
                '${data.Slug}'
            )`);

        if (result.rowsAffected && result.rowsAffected[0] > 0) {
            return { success: true, message: 'Bản ghi đã được chèn thành công.' };
        } else {
            return { success: false, message: 'Không có bản ghi nào được chèn.' };
        }
    } catch (error) {
        console.error('Lỗi khi chèn bản ghi:', error);
        return { success: false, message: 'Lỗi khi chèn bản ghi.' };
    }
}

module.exports.update = async (id, data) => {
    try {
        let updates = [];

        if (data.Title) updates.push(`Title = '${data.Title}'`);
        if (data.Description) updates.push(`Description = '${data.Description}'`);
        if (data.Slug) updates.push(`Slug = '${data.Slug}'`);

        if (updates.length === 0) {
            return { success: false, message: 'Không có trường nào được cập nhật.' };
        }

        const query = `
            UPDATE Game
            SET ${updates.join(', ')}
            WHERE GameId = '${id}'
        `;

        const record = await db.pool.request().query(query);

        if (record.rowsAffected && record.rowsAffected[0] > 0) {
            return { success: true, message: 'Bản ghi đã được cập nhật thành công.' };
        } else {
            return { success: false, message: 'Không có bản ghi nào được cập nhật.' };
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật bản ghi:', error);
        return { success: false, message: 'Lỗi khi cập nhật bản ghi.' };
    }  
}

module.exports.delete = async (id) => {
    try {
        const result = await db.pool.request().query(`
            DELETE FROM Permission 
            WHERE PermissionId = '${id}'
        `);
    } catch (error) {
        return error.message;
    }
}

