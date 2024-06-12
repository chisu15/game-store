const Discount = require("../models/discount.model");
const {
    createSlug
} = require("../helpers/createSlug");
const {
    generateRandomString
} = require("../helpers/generate");

// [GET] ALL
module.exports.index = async (req, res) => {
    try {
        const discounts = await Discount.getAll();
        res.json({
            code: 200,
            discounts
        });
    } catch (error) {
        res.json({
            code: 500,
            message: error.message
        });
    }
}


// [GET] DETAIL
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const discount = await Discount.detail(id);
        res.json({
            code: 200,
            discount
        });
    } catch (error) {
        res.json({
            code: 500,
            message: error.message
        });
    }
}

// [POST] CREATE
module.exports.create = async (req, res) => {
    try {
        const data = {
            ...req.body,
            id: generateRandomString(22),
            code: generateRandomString(6)
        }
        await Discount.create(data);
        res.json({
            code: 200,
            message: "Tạo mã giảm giá thành công!"
        });
    } catch (error) {
        res.json({
            code: 500,
            message: error.message
        });
    }
}