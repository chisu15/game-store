const Admin = require("../models/admin.model");

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
// module.exports.login =  async (res, req)=> {
//     try {
//         const info = req.body;
//         const emailExist = await Admin.findOne({ email: info.email });
//         console.log("qưdqwdqwdwqdwq", emailExist);
//     } catch (error) {
        
//     }
// }