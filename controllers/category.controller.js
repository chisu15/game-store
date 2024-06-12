const sequelize = require("sequelize");
const Category= require("../models/category.model");
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
      const listCategory = await Category.getAll();
      res.status(200).json({
         code: 200,
         listCategory
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
      const detailCategory = await Category.detail(id);
      res.status(200).json({
         code: 200,
         Category: detailCategory
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

      await Category.create(data);
      res.json({
         code: 200,
         message: "Tạo thành công!",
         data
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
      const categoryBefore = await Category.detail(id)
      if (categoryBefore.title != data.title) {
         data.slug = createSlug(data.title);
      }
      await Category.update(id, data)
      res.json({
         code: 200,
         message: "Cập nhật thành công!",
         category: await Category.detail(id)
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
      const category = await Category.detail(id)
      if (!category) {
         return res.status(404).json({
            code: 404,
            message: "Không tìm thấy danh mục"
         });
      }
      await Category.delete(id);
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
         const categoryBefore = await Category.detail(id);
         if (data.title) {
            if (categoryBefore.title != data.title) {
               data.slug = createSlug(data.title);
            }
         }
         await Category.update(id, data)
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