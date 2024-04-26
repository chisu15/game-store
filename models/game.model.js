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

// module.exports.update = async (id, data) => {
//     try {
//         const record = await db.pool.request().query(`
//             UPDATE Game
//             SET 
//             WHERE GameId = '${id}'
//         `);
//     } catch (error) {
//         return error.message;
//     }  
// }