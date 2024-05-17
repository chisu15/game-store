const sequelize = require("sequelize");
const Permission= require("../models/permission.model");
const {
   createSlug
} = require("../helpers/createSlug");
const {
   generateRandomString
} = require("../helpers/generate");
// const Admin = require("../models/admin.model");
// const Category = require("../models/category.model");
// const GameCategory = require("../models/gameCategory.model");
// const Associate = require("../models/index.model");
// [GET] INDEX
module.exports.index = async (req, res) => {
   try {
      const permission = await Permission.getAll();
      res.status(200).json({
         code: 200,
         permission: permission
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
      const permission = await Permission.detail(id);
      res.status(200).json({
         code: 200,
         permission: permission
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
      const data = {
        id: generateRandomString(22),
        ...req.body,
        slug: createSlug(req.body.title)
      };
      console.log(req.body);

      await Permission.create(data);
      res.json({
         code: 200,
         message: "Tạo thành công!",
         permission: data
      })
   } catch (err) {
      res.json({
         code: 400,
         message: "Tạo thất bại!",
         err: err.message
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
      const permissionBefore = await Permission.detail(id)
      if (permissionBefore.title != data.title) {
         data.slug = createSlug(data.title);
      }
      await Permission.update(id, data)
      res.json({
         code: 200,
         message: "Cập nhật thành công!",
         permission: await Permission.detail(id)
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
      const permission = await Permission.detail(id)
      if (!permission) {
         return res.status(404).json({
            code: 404,
            message: "Không tìm thấy quyền"
         });
      }
      await Permission.delete(id);
      res.json({
         code: 200,
         message: "Xóa thành công!"
      });
   } catch (error) {
      res.json({
         code: 400,
         message: "Xóa thất bại!",
         err: error
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
         const permissionBefore = await Permission.detail(id);
         if (data.title) {
            if (permissionBefore.title != data.title) {
               data.slug = createSlug(data.title);
            }
         }
         await Permission.update(id, data)
      }
      res.json({
         code: 200,
         message: "Cập nhật thành công!",
      })
   } catch (error) {
      res.json({
         code: 400,
         message: "Cập nhật thất bại !",
         err: error
      });
   }
}