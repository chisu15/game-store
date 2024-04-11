const sequelize = require("sequelize");
const Game = require("../models/game.model");
const {
   createSlug
} = require("../helpers/createSlug");
const { generateRandomString } = require("../helpers/generate");

// [GET] INDEX
module.exports.index = async (req, res) => {
   try {

      const games = await Game.findAll()

      res.status(200).json({
         code: 200,
         games: games
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
      const game = await Game.findByPk(id)
      res.status(200).json(game);
   } catch (err) {
      res.status(800).json(err);
   }
}

// [POST] CREATE
module.exports.create = async (req, res) => {
   try {
      const data = req.body;
      console.log(req.body);
      await Game.create({
         GameId: generateRandomString(32),
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
      const gameBefore = await Game.findByPk(id)
      if (gameBefore.Name != data.Name) {
         data.Slug = createSlug(data.Name);
      }
      const gameAfter = await Game.update(data, {
         where: {
            GameId: id
         }
      })
      res.json({
         code: 200,
         message: "Cập nhật thành công!",
         game: await Game.findByPk(id)
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
      const game = await Game.findByPk(id)
      if (!game) {
         return res.status(404).json({
            code: 404,
            message: "Không tìm thấy game"
         });
      }
      await game.destroy();
      

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
   const {ids} = req.params;
   ids.forEach(id => {
      console.log(id, '\n');
   });
}