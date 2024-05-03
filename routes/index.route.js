const gameRoute = require('./game.route');
const categoryRoute = require('./category.route');
// const userRoute = require('./user.route');
// const adminRoute = require('./admin.route');
const permissionRoute = require('./permission.route')

module.exports = (app) =>
{
    const version = "/api/v1";
    app.use(version + "/games", gameRoute);
    app.use(version + "/category", categoryRoute);
    // app.use(version + "/users", userRoute);
    // app.use(version + "/admin", adminRoute);
    app.use(version + "/permission", permissionRoute);
}