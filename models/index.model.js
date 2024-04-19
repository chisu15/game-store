const Admin = require("./admin.model");
const Category = require('./category.model');
const GameCategory = require("./gameCategory.model");
const Game = require("./game.model");

Game.belongsTo(Admin, { foreignKey: 'CreatedBy' });
Game.belongsToMany(Category, { through: 'GameCategory'});
Category.belongsTo(Admin, { foreignKey: 'CreatedBy' });
Category.belongsToMany(Game, { through: 'GameCategory'});

module.exports = {Game, Category, Admin}