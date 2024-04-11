const gameRoute = require('./game.route');
// const gameCategoryRoute = require('./gameCategory.route');
// const userRoute = require('./user.route');
const adminRoute = require('./admin.route');
// const permissionRoute = require('./permission.route')

module.exports = (app) =>
{
    const version = "/api/v1";
    app.use(version + "/games", gameRoute);
    // app.use(version + "/gameCategory", gameCategoryRoute);
    // app.use(version + "/users", userRoute);
    app.use(version + "/admin", adminRoute);
    // app.use(version + "/permission", permissionRoute);
}