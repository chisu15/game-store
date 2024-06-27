const fs = require('fs');
const path = require('path');
const Game = require('../models/game.model');
const { createSlug } = require('../helpers/createSlug');
const { generateRandomString } = require('../helpers/generate');

const uploadDirectory = path.join(__dirname, '../uploads/');

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// [GET] INDEX
module.exports.index = async (req, res) => {
    try {
        const games = await Game.getAll();
        res.status(200).json({
            code: 200,
            games: games
        });
    } catch (err) {
        res.json({
            code: 800,
            message: 'Lấy dữ liệu thất bại!',
            error: err.message
        });
        console.log(err);
    }
};

// [GET] DETAIL
module.exports.detail = async (req, res) => {
    try {
        const { id } = req.params;
        const game = await Game.detail(id);
        res.status(200).json({
            code: 200,
            game: game
        });
    } catch (err) {
        res.json({
            code: 800,
            message: 'Lấy dữ liệu thất bại!',
            error: err.message
        });
        console.log(err);
    }
};

// [POST] CREATE
module.exports.create = async (req, res) => {
    try {
        const data = {
            id: generateRandomString(22),
            ...req.body,
            slug: createSlug(req.body.title)
        };
        console.log('Dữ liệu nhận được:', req.body);

        if (req.files && req.files.images) {
            const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
            data.images = [];
            for (let imageFile of images) {
                const uploadPath = path.join(uploadDirectory, imageFile.name);
                await imageFile.mv(uploadPath);
                data.images.push(`/uploads/${imageFile.name}`);
            }
        } else {
            data.images = req.body.images || [];
        }

        await Game.create(data);
        res.status(201).json({
            code: 201,
            message: 'Tạo game mới thành công!',
            game: data
        });
    } catch (err) {
        res.status(400).json({
            code: 400,
            message: 'Không thể tạo game mới!',
            error: err.message
        });
    }
};

// [PATCH] EDIT
module.exports.edit = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        // console.log(data, id);
        // if (req.files && req.files.image) {
        //     const imageFile = req.files.image;
        //     const uploadPath = path.join(uploadDirectory, imageFile.name);
        //     await imageFile.mv(uploadPath);

        //     data.image = `/uploads/${imageFile.name}`;
        // }
        const gameBefore = await Game.detail(id);
        // console.log(gameBefore);
        if (gameBefore && data.title) {
            if (gameBefore.title != data.title) {
                data.slug = createSlug(data.title);
            }
            console.log(111111111111111111111111111);
        }
        console.log(data, id);
        await Game.update(id, data);
        res.json({
            code: 200,
            message: "Cập nhật thành công!",
            game: await Game.detail(id)
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật thất bại!",
            err: error.message
        });
    }
};

// [DELETE] DELETE
module.exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const game = await Game.detail(id);
        if (!game) {
            return res.status(404).json({
                code: 404,
                message: 'Không tìm thấy game'
            });
        }
        await Game.delete(id);
        res.json({
            code: 200,
            message: 'Xóa thành công!'
        });
    } catch (error) {
        res.json({
            code: 400,
            message: 'Xóa thất bại!',
            err: error.message
        });
    }
};

// [PATCH] CHANGE MULTI
module.exports.changeMulti = async (req, res) => {
    try {
        const { ids, data } = req.body;
        console.log({ ids, data });
        for (const id of ids) {
            console.log('ID:', id, '\n');
            const gameBefore = await Game.detail(id);
            if (data.title && gameBefore.title !== data.title) {
                data.slug = createSlug(data.title);
            }
            await Game.update(id, data);
        }
        res.json({
            code: 200,
            message: 'Cập nhật thành công!'
        });
    } catch (error) {
        res.json({
            code: 400,
            message: 'Cập nhật thất bại!',
            err: error.message
        });
    }
};
