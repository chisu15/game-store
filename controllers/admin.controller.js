const { where } = require("sequelize");
const { generateRandomString } = require("../helpers/generate");
const Admin = require("../models/admin.model");
const md5 = require("md5");
// [GET] LIST ADMIN
module.exports.listAdmin = async(req, res) => {
    try {
        const admin = await Admin.findAll();
         res.json({
            code: 200,
            Accounts: admin
         });
    } catch (error) {
        res.json({
            code: 800,
            error: error
        });
    }

}
// [POST] CREATE
module.exports.create = async(req, res) => {
    try {
        const info = req.body;
        const admin =  await Admin.create({
            AdminId: generateRandomString(22),
            ...info,
            Password: md5(info.Password),
            Token: generateRandomString(32),
        })
         res.json({
            code: 200,
            message: "Tạo thành công !"
         });
    } catch (error) {
        res.json({
            code: 800,
            message: "Tạo thất bại !",
            error: error
        });
    }
}

// [GET] LOGIN
module.exports.login =  async (req, res)=> {
    try {
        const info = req.body;
        const admin = await Admin.findAll({
            where: {

                Username: info.Username,
                Password: md5(info.Password)
            }
        })
        if (admin)
        {
            res.json({
                code: 200,
                message: "Đăng nhập thành công!"
            })
        }
        else{
            res.json({
                code: 800,
                message: "Đăng nhập thất bại!"
            })
        }
    } catch (error) {
        res.json({
            code: 800,
            message: "Đăng nhập thất bại!",
            error: error
        })
    }
}