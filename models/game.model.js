const db = require('../configs/db');


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
            Where GameId = '${id}'
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
            INSERT INTO Game (GameId, Title, AdminId, CategoryId, Price, DiscountId, Description, Images, DownloadLink, Slug)
            VALUES (
                '${data.GameId}', 
                '${data.Title}',
                '${data.AdminId}',
                '${data.CategoryId}',
                '${data.Price}',
                '${data.DiscountId}',
                '${data.Description}',
                '${data.Images}',
                '${data.DownloadLink}',
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
        if (data.AdminId) updates.push(`AdminId = '${data.AdminId}'`);
        if (data.CategoryId) updates.push(`CategoryId = '${data.CategoryId}'`);
        if (data.Price) updates.push(`Price = ${data.Price}`);
        if (data.DiscountId) updates.push(`DiscountId = ${data.DiscountId}`);
        if (data.Description) updates.push(`Description = '${data.Description}'`);
        if (data.Images) updates.push(`Images = '${data.Images}'`);
        if (data.DownloadLink) updates.push(`DownloadLink = '${data.DownloadLink}'`);
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
            DELETE FROM Game 
            WHERE GameId = '${id}'
        `);
    } catch (error) {
        return error.message;
    }
}

