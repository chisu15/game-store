const sequelize = require("sequelize");
const Admin = require("../models/admin.model");
const {
    createSlug
} = require("../helpers/createSlug");
const {
    generateRandomString
} = require("../helpers/generate");
const md5 = require("md5");
// const Admin = require("../models/admin.model");
// const Admin = require("../models/Admin.model");
// const GameAdmin = require("../models/gameAdmin.model");
// const Associate = require("../models/index.model");
// [GET] INDEX
module.exports.index = async (req, res) => {
    try {
        const listAdmin = await Admin.getAll();
        res.status(200).json({
            code: 200,
            listAdmin
        });

    } catch (err) {
        res.json({
            code: 800,
            message: "Lấy dữ liệu thất bại!",
            error: err.message
        });;
        console.log(err);
    }

}
//  [GET] DETAIL
module.exports.detail = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const detailAdmin = await Admin.detail(id);
        res.status(200).json({
            code: 200,
            admin: detailAdmin
        });
    } catch (err) {
        res.json({
            code: 800,
            message: "Lấy dữ liệu thất bại!",
            error: err.message
        });;
        console.log(err);
    }
}

// [POST] CREATE
module.exports.create = async (req, res) => {
    try {
        const password = md5(req.body.Password);
        const data = {
            ...req.body,
            id: generateRandomString(22),
            token: generateRandomString(32),
            password: password,
        };
        const nameAvailable = await Admin.check("username", data.Username);
        const emailAvailable = await Admin.check("email", data.Email);
        if (nameAvailable.length > 0) {
            return res.status(400).json({
                code: 400,
                message: "Tên đăng nhập đã tồn tại"
            });
        } else if (emailAvailable.length > 0) {
            return res.status(400).json({
                code: 400,
                message: "Email đã được sử dụng"
            });
        } else {
            const createResult = await Admin.create(data);
            if (createResult.success) {
                res.status(200).json({
                    code: 200,
                    message: "Tạo thành công!",
                    data
                });
            } else {
                throw new Error(createResult.message);
            }
        }
    } catch (err) {
        res.status(400).json({
            code: 400,
            message: "Tạo thất bại!",
            error: err.message
        });
    }
}

// [PATCH] EDIT
module.exports.edit = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const data = req.body;
        const AdminBefore = await Admin.detail(id);
        await Admin.update(id, data)
        res.json({
            code: 200,
            message: "Cập nhật thành công!",
            admin: await Admin.detail(id)
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật thất bại!",
            err: error.message
        });
    }
}

// [DELETE] DELETE
module.exports.delete = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const admin = await Admin.detail(id)
        if (!admin) {
            return res.status(404).json({
                code: 404,
                message: "Không tìm thấy"
            });
        }
        await Admin.delete(id);
        res.json({
            code: 200,
            message: "Xóa thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa thất bại!",
            err: error.message
        });
    }
}

// [PATCH] CHANGE MULTI
module.exports.changeMulti = async (req, res) => {
    try {
        const {
            ids,
            data
        } = req.body;
        console.log({
            ids,
            data
        });
        for (const id of ids) {
            console.log("ID:", id, "\n");
            const AdminBefore = await Admin.detail(id);
            await Admin.update(id, data)
        }
        res.json({
            code: 200,
            message: "Cập nhật thành công!",
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật thất bại !",
            err: error.message
        });
    }
}

// [POST] LOGIN
module.exports.login = async (req, res) => {
    try {
        const passwordHashed = md5(req.body.password);
        console.log("passwordHashed: ", passwordHashed);
        const username = req.body.username;

        const admin = await Admin.check("username", username);
        const passwordValid = passwordHashed == admin[0].password;
        if (!admin) {
            return res.json({
                code: 404,
                message: "Tên người dùng không tồn tại!"
            });
        }
        else if (!passwordValid) {
            return res.json({
                code: 401,
                message: "Mật khẩu không chính xác!"
            });
        }
        else {
            res.json({
                code: 200,
                message: "Đăng nhập thành công!",
                token: admin[0].token
            });
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Đăng nhập thất bại!",
            err: error.message
        });
    }
}