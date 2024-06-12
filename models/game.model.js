const db = require('../configs/db');
const mssql = require("mssql");


module.exports.getAll = async () => {
    try {
        const gameRecords = await db.pool.request().query(`
            SELECT g.*, gc.categoryId
            FROM Game g
            LEFT JOIN GameCategory gc ON g.id = gc.gameId
        `);
        const games = gameRecords.recordset;

        // Tạo một đối tượng để lưu trữ kết quả cuối cùng
        const result = {};

        // Kết hợp dữ liệu từ bảng Game và GameCategory
        games.forEach(game => {
            if (!result[game.id]) {
                result[game.id] = {
                    id: game.id,
                    title: game.title,
                    admin: game.admin,
                    price: game.price,
                    discount: game.discount,
                    description: game.description,
                    image: game.image,
                    downloadLink: game.downloadLink,
                    slug: game.slug,
                    categories: []
                };
            }
            if (game.categoryId) {
                result[game.id].categories.push(game.categoryId);
            }
        });

        // Chuyển đổi kết quả sang mảng
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
        const gameRecord = await request.query(`
            SELECT g.*, gc.categoryId
            FROM Game g
            LEFT JOIN GameCategory gc ON g.id = gc.gameId
            WHERE g.id = @id
        `);

        const games = gameRecord.recordset;

        if (games.length === 0) {
            return { success: false, message: 'Không tìm thấy trò chơi.' };
        }

        const gameDetail = {
            id: games[0].id,
            title: games[0].title,
            admin: games[0].admin,
            price: games[0].price,
            discount: games[0].discount,
            description: games[0].description,
            image: games[0].image,
            downloadLink: games[0].downloadLink,
            slug: games[0].slug,
            categories: []
        };

        games.forEach(game => {
            if (game.categoryId) {
                gameDetail.categories.push(game.categoryId);
            }
        });

        return gameDetail;
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết trò chơi:', error);
        return { success: false, message: error.message };
    }
};


module.exports.create = async (data) => {
    const transaction = new mssql.Transaction(db.pool);
    try {
        await transaction.begin();

        const request = new mssql.Request(transaction);

        request.input('id', mssql.NVarChar, data.id);
        request.input('title', mssql.NVarChar, data.title);
        request.input('admin', mssql.NVarChar, data.admin);
        request.input('price', mssql.Decimal, data.price);
        request.input('discount', mssql.NVarChar, data.discount);
        request.input('description', mssql.NVarChar, data.description);
        request.input('image', mssql.Text, data.image);
        request.input('downloadLink', mssql.NVarChar, data.downloadLink);
        request.input('slug', mssql.NVarChar, data.slug);

        const gameResult = await request.query(`
            INSERT INTO Game (id, title, admin, price, discount, description, image, downloadLink, slug)
            VALUES (@id, @title, @admin, @price, @discount, @description, @image, @downloadLink, @slug)
        `);

        if (gameResult.rowsAffected && gameResult.rowsAffected[0] > 0) {
            for (const category of data.category) {
                const categoryRequest = new mssql.Request(transaction);
                categoryRequest.input('gameId', mssql.NVarChar, data.id);
                categoryRequest.input('categoryId', mssql.NVarChar, category);

                await categoryRequest.query(`
                    INSERT INTO GameCategory (gameId, categoryId)
                    VALUES (@gameId, @categoryId)
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
        if (data.title) { updates.push(`title = @title`); request.input('title', mssql.NVarChar, data.title); }
        if (data.admin) { updates.push(`admin = @admin`); request.input('admin', mssql.NVarChar, data.admin); }
        if (data.price) { updates.push(`price = @price`); request.input('price', mssql.Decimal, data.price); }
        if (data.discount) { updates.push(`discount = @discount`); request.input('discount', mssql.NVarChar, data.discount); }
        if (data.description) { updates.push(`description = @description`); request.input('description', mssql.NVarChar, data.description); }
        if (data.image) { updates.push(`image = @image`); request.input('image', mssql.Text, data.image); }
        if (data.downloadLink) { updates.push(`downloadLink = @downloadLink`); request.input('downloadLink', mssql.NVarChar, data.downloadLink); }
        if (data.slug) { updates.push(`slug = @slug`); request.input('slug', mssql.NVarChar, data.slug); }

        if (updates.length === 0) {
            return { success: false, message: 'Không có trường nào được cập nhật.' };
        }

        const query = `
            UPDATE Game
            SET ${updates.join(', ')}
            WHERE id = @id
        `;

        const record = await request.query(query);

        if (record.rowsAffected && record.rowsAffected[0] > 0) {
            // Xóa các danh mục cũ và thêm các danh mục mới
            await request.query(`
                DELETE FROM GameCategory WHERE gameId = @id
            `);

            if (data.category && data.category.length > 0) {
                for (const category of data.category) {
                    const categoryRequest = new mssql.Request(transaction);
                    categoryRequest.input('gameId', mssql.NVarChar, id);
                    categoryRequest.input('categoryId', mssql.NVarChar, category);

                    await categoryRequest.query(`
                        INSERT INTO GameCategory (gameId, categoryId)
                        VALUES (@gameId, @categoryId)
                    `);
                }
            }

            await transaction.commit();
            return { success: true, message: 'Bản ghi đã được cập nhật thành công.' };
        } else {
            await transaction.rollback();
            return { success: false, message: 'Không có bản ghi nào được cập nhật.' };
        }
    } catch (error) {
        await transaction.rollback();
        console.error('Lỗi khi cập nhật bản ghi:', error);
        return { success: false, message: 'Lỗi khi cập nhật bản ghi.' };
    }
};


module.exports.delete = async (id) => {
    try {
        const request = db.pool.request();
        request.input('id', mssql.NVarChar, id);
        const result = await request.query(`
            DELETE FROM Game 
            WHERE id = @id
        `);
        if (result.rowsAffected && result.rowsAffected[0] > 0) {
            return { success: true, message: 'Bản ghi đã được xóa thành công.' };
        } else {
            return { success: false, message: 'Không có bản ghi nào được xóa.' };
        }
    } catch (error) {
        console.error('Lỗi khi xóa bản ghi:', error);
        return { success: false, message: error.message };
    }
};
