const db = require('../configs/db');
const mssql = require("mssql");

module.exports.getAll = async () => {
    try {
        const record = await db.pool.request().query('select * from Game');
        const result = record.recordset;
        return result;
    } catch (error) {
        return error.message;
    }
};

module.exports.detail = async (id)=> {
    try {
        const record = await db.pool.request().query(`
            SELECT * FROM Game
            Where id = '${id}'
        `);
        const result = record.recordset;
        return result;
    } catch (error) {
        return error.message;
    }   
}


module.exports.create = async (data) => {
    const transaction = new mssql.Transaction(db.pool);
    try {
        await transaction.begin();

        const request = new mssql.Request(transaction);

        // Thêm các kiểu dữ liệu vào request
        request.input('id', mssql.NVarChar, data.id);
        request.input('title', mssql.NVarChar, data.title);
        request.input('admin', mssql.NVarChar, data.admin);
        request.input('price', mssql.Decimal, data.price);
        request.input('discount', mssql.NVarChar, data.discount);
        request.input('description', mssql.NVarChar, data.description);
        request.input('images', mssql.Image, data.images); // Chuyển đổi chuỗi Base64 thành Buffer
        request.input('downloadLink', mssql.NVarChar, data.downloadLink);
        request.input('slug', mssql.NVarChar, data.slug);

        // Chèn vào bảng Game
        const gameResult = await request.query(`
            INSERT INTO Game (id, title, admin, price, discount, description, images, downloadLink, slug)
            VALUES (@id, @title, @admin, @price, @discount, @description, @images, @downloadLink, @slug)
        `);

        if (gameResult.rowsAffected && gameResult.rowsAffected[0] > 0) {
            // Chèn vào bảng nối GameCategory
            for (const category of data.category) {
                const categoryRequest = new mssql.Request(transaction);
                categoryRequest.input('id', mssql.NVarChar, data.id);
                categoryRequest.input('category', mssql.NVarChar, category);

                await categoryRequest.query(`
                    INSERT INTO GameCategory (game, category)
                    VALUES (@id, @category)
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
}


module.exports.update = async (id, data) => {
    try {
        let updates = [];

        if (data.title) updates.push(`title = '${data.title}'`);
        if (data.admin) updates.push(`admin = '${data.admin}'`);
        if (data.category) updates.push(`category = '${data.category}'`);
        if (data.price) updates.push(`price = ${data.price}`);
        if (data.discount) updates.push(`discount = ${data.discount}`);
        if (data.description) updates.push(`description = '${data.description}'`);
        if (data.images) updates.push(`images = '${data.images}'`);
        if (data.downloadLink) updates.push(`downloadLink = '${data.downloadLink}'`);
        if (data.slug) updates.push(`slug = '${data.slug}'`);

        if (updates.length === 0) {
            return { success: false, message: 'Không có trường nào được cập nhật.' };
        }

        const query = `
            UPDATE Game
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
            DELETE FROM Game 
            WHERE id = '${id}'
        `);
    } catch (error) {
        return error.message;
    }
}

