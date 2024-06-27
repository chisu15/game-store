const db = require('../configs/db');
const mssql = require('mssql');
const {
    generateRandomString
} = require("../helpers/generate");

module.exports.getAll = async () => {
    try {
        const record = await db.pool.request().query('SELECT * FROM [User]');
        return record.recordset;
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports.detail = async (id) => {
    try {
        const request = db.pool.request();
        request.input('id', mssql.NVarChar, id);
        const userRecord = await request.query(`
                SELECT u.*, ug.gameId
                FROM [User] u
                LEFT JOIN UserGame ug ON u.id = ug.userId
                WHERE u.id = @id
            `);
        const users = userRecord.recordset;

        if (users.length === 0) {
            return {
                success: false,
                message: 'Không tìm thấy người dùng.'
            };
        }

        const userDetail = {
            id: users[0].id,
            username: users[0].username,
            password: users[0].password,
            email: users[0].email,
            googleId: users[0].googleId,
            games: []
        };

        users.forEach(user => {
            if (user.gameId) {
                userDetail.games.push(user.gameId);
            }
        });

        return userDetail;
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports.create = async (data) => {
    const transaction = new mssql.Transaction(db.pool);
    try {
        await transaction.begin();

        const request = new mssql.Request(transaction);

        request.input('id', mssql.NVarChar, data.id);
        request.input('username', mssql.NVarChar, data.username);
        request.input('email', mssql.NVarChar, data.email);
        request.input('googleId', mssql.NVarChar, data.googleId);
        request.input('picture', mssql.NVarChar, data.picture);

        const userResult = await request.query(`
            INSERT INTO [User] (id, username, email, googleId, picture)
            VALUES (@id, @username, @email, @googleId, @picture)
        `);

        if (userResult.rowsAffected && userResult.rowsAffected[0] > 0) {
            if (Array.isArray(data.games)) {
                for (const gameId of data.games) {
                    const gameRequest = new mssql.Request(transaction);
                    gameRequest.input('userId', mssql.NVarChar, data.id);
                    gameRequest.input('gameId', mssql.NVarChar, gameId);

                    await gameRequest.query(`
                        INSERT INTO UserGame (userId, gameId)
                        VALUES (@userId, @gameId)
                    `);
                }
            }

            await transaction.commit();
            return {
                success: true,
                message: 'Người dùng đã được tạo thành công.'
            };
        } else {
            await transaction.rollback();
            return {
                success: false,
                message: 'Không thể tạo người dùng.'
            };
        }
    } catch (error) {
        await transaction.rollback();
        return {
            success: false,
            message: error.message
        };
    }
};


module.exports.update = async (id, data) => {
    const transaction = new mssql.Transaction(db.pool);
    try {
        await transaction.begin();

        let updates = [];
        const request = new mssql.Request(transaction);

        request.input('id', mssql.NVarChar, id);
        if (data.username) {
            updates.push(`username = @username`);
            request.input('username', mssql.NVarChar, data.username);
        }
        if (data.password) {
            updates.push(`password = @password`);
            request.input('password', mssql.NVarChar, data.password);
        }
        if (data.email) {
            updates.push(`email = @email`);
            request.input('email', mssql.NVarChar, data.email);
        }
        if (data.googleId) {
            updates.push(`googleId = @googleId`);
            request.input('googleId', mssql.NVarChar, data.googleId);
        }

        if (updates.length === 0) {
            return {
                success: false,
                message: 'Không có trường nào được cập nhật.'
            };
        }

        const query = `
                UPDATE [User]
                SET ${updates.join(', ')}
                WHERE id = @id
            `;

        const userResult = await request.query(query);

        if (userResult.rowsAffected && userResult.rowsAffected[0] > 0) {
            await request.query(`
                    DELETE FROM UserGame WHERE userId = @id
                `);

            if (data.games && data.games.length > 0) {
                for (const gameId of data.games) {
                    const gameRequest = new mssql.Request(transaction);
                    gameRequest.input('userId', mssql.NVarChar, id);
                    gameRequest.input('gameId', mssql.NVarChar, gameId);

                    await gameRequest.query(`
                            INSERT INTO UserGame (userId, gameId)
                            VALUES (@userId, @gameId)
                        `);
                }
            }

            await transaction.commit();
            return {
                success: true,
                message: 'Người dùng đã được cập nhật thành công.'
            };
        } else {
            await transaction.rollback();
            return {
                success: false,
                message: 'Không thể cập nhật người dùng.'
            };
        }
    } catch (error) {
        await transaction.rollback();
        return {
            success: false,
            message: error.message
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
                DELETE FROM UserGame 
                WHERE userId = @id
            `);

        const result = await request.query(`
                DELETE FROM [User] 
                WHERE id = @id
            `);

        await transaction.commit();
        return {
            success: true,
            message: 'Người dùng đã được xóa thành công.'
        };
    } catch (error) {
        await transaction.rollback();
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports.findOne = async (criteria) => {
    try {
        const { googleId } = criteria;
        const request = db.pool.request();
        request.input('googleId', mssql.NVarChar, googleId);
        const userRecord = await request.query(`
            SELECT * FROM [User] WHERE googleId = @googleId
        `);

        if (userRecord.recordset.length > 0) {
            return userRecord.recordset[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error in findOne:', error);
        throw new Error('Lỗi khi lấy thông tin người dùng');
    }
};

module.exports.findAndUpdate = async (criteria, updateData) => {
    try {
        const { googleId } = criteria;
        const request = db.pool.request();
        request.input('googleId', mssql.NVarChar, googleId);
        request.input('email', mssql.NVarChar, updateData.email);
        request.input('username', mssql.NVarChar, updateData.username);
        request.input('picture', mssql.NVarChar, updateData.picture);

        // Kiểm tra người dùng đã tồn tại chưa
        const existingUser = await request.query(`
            SELECT * FROM [User] WHERE googleId = @googleId
        `);

        if (existingUser.recordset.length > 0) {
            // Người dùng đã tồn tại, cập nhật thông tin
            await request.query(`
                UPDATE [User]
                SET email = @email,
                    username = @username,
                    picture = @picture
                WHERE googleId = @googleId
            `);
        } else {
            // Người dùng chưa tồn tại, chèn mới
            const newId = generateRandomString(22); // Tạo id duy nhất
            request.input('id', mssql.NVarChar, newId);
            await request.query(`
                INSERT INTO [User] (id, googleId, email, username)
                VALUES (@id, @googleId, @email, @username)
            `);
        }

        // Trả về người dùng đã cập nhật hoặc chèn mới
        const user = await request.query(`
            SELECT * FROM [User] WHERE googleId = @googleId
        `);
        return user.recordset[0];

    } catch (error) {
        console.error('Error in findAndUpdate:', error);
        throw new Error('Lỗi khi tìm và cập nhật thông tin người dùng');
    }
};