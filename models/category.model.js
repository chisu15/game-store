const db = require('../configs/db');


module.exports.getAll = async () => {
    try {
        const record = await db.pool.request().query('select * from Category');
        const result = record.recordset;
        return result;
    } catch (error) {
        return error.message;
    }
};

module.exports.detail = async (id)=> {
    try {
        const record = await db.pool.request().query(`
            SELECT * FROM Category
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
            INSERT INTO Category (id, title, description, slug)
            VALUES (
                '${data.id}', 
                '${data.title}',
                '${data.description}',
                '${data.slug}'
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

        if (data.title) updates.push(`title = '${data.title}'`);
        if (data.description) updates.push(`description = '${data.description}'`);
        if (data.slug) updates.push(`slug = '${data.slug}'`);

        if (updates.length === 0) {
            return { success: false, message: 'Không có trường nào được cập nhật.' };
        }

        const query = `
            UPDATE Category
            SET ${updates.join(', ')}
            WHERE id = '${id}'
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
            DELETE FROM Category 
            WHERE id = '${id}'
        `);
    } catch (error) {
        return error.message;
    }
}

