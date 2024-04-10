const Game = require("../models/game.model");

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
      const { Name, Price, UploadDate, Discount, Description, Requirement, Images, DownloadLink } = req.body;
      console.log(req.body);
      const data = { Name, Price, UploadDate, Discount, Description, Requirement, Images, DownloadLink };
      await Game.create(data);
      res.json({
         code:200,
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


}