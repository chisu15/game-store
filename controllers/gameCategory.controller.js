const sequelize = require("sequelize");
const Category = require("../models/category.model");
const {
   createSlug
} = require("../helpers/createSlug");
const {
   generateRandomString
} = require("../helpers/generate");
const Admin = require("../models/admin.model");
// [GET] INDEX
module.exports.index = async (req, res) => {
   try {

      // const categorys = await category.findAll({
      //    include: [Admin],
      // })

      const category = await Category.findAll()

      res.status(200).json({
         code: 200,
         category: category
      });
   } catch (err) {
      res.status(800).json(err);
      console.log(err);
   }

}
//  [GET] DETAIL
module.exports.detail = async (req, res) => {
   try {
      const {
         id
      } = req.params;
      const category = await Category.findByPk(id)
      res.status(200).json(category);
   } catch (err) {
      res.status(800).json(err);
   }
}

// [POST] CREATE
module.exports.create = async (req, res) => {
   try {
      const data = req.body;
      console.log(req.body);
      await Category.create({
         CategoryId: generateRandomString(22),
         ...data,
         Slug: createSlug(data.Name)
      });
      res.json({
         code: 200,
         message: "Tạo thành công!",
      })
   } catch (err) {
      res.json({
         code: 400,
         message: "Tạo thất bại!",
         err: err
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
      const cateBefore = await Category.findByPk(id)
      if (cateBefore.Name != data.Name) {
         data.Slug = createSlug(data.Name);
      }
      const cateAfter = await Category.update(data, {
         where: {
            CategoryId: id
         }
      })
      res.json({
         code: 200,
         message: "Cập nhật thành công!",
         category: await Category.findByPk(id)
      })
   } catch (error) {
      res.json({
         code: 400,
         message: "Cập nhật thất bại!",
         err: error
      });
   }
}

// [DELETE] DELETE
module.exports.delete = async (req, res) => {
   try {
      const {
         id
      } = req.params;
      const category = await Category.findByPk(id)
      if (!category) {
         return res.status(404).json({
            code: 404,
            message: "Không tìm thấy category"
         });
      }
      await Category.destroy();


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
         const categoryBefore = await Category.findByPk(id);
         if (data.Name) {
            if (categoryBefore.Name != data.Name) {
               data.Slug = createSlug(data.Name);
            }
         }
         const categoryAfter = await Category.update(data, {
            where: {
               categoryId: id
            }
         })
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