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

      const record = await pool.request().query(`select * from Game where GameID = ${id}`);
      const result = record.recordset;
      res.status(200).json(result);
   } catch (err) {
      res.status(800).json(err);
   }
}

// [POST] CREATE
module.exports.create = async (req, res) => {
   try {
      const data = req.body;
      console.log(data);
      const record = await pool.request().query(`
      INSERT INTO Game(Name, Price, UploadDate, Discount, Description, Requirement, Images, DownloadLink)
      VALUES ('${data.Name}', ${data.Price}, ${data.UploadDate}, ${data.Discount}, '${data.Description}', '${data.Requirement}', '${data.Images}', '${data.DownloadLink}');
  `);
      res.json({
         code:200,
         message: "Tạo thành công!"
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