const User = require('../models/user.model');
const {
    generateRandomString
} = require("../helpers/generate");
const md5 = require("md5");
const {
    OAuth2Client
} = require('google-auth-library');
const redirectUrl = 'http://localhost:3000/user/profile'


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);

module.exports.index = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json({
            code: 200,
            users
        });
    } catch (error) {
        res.json({
            code: 400,
            message: 'Lỗi khi lấy danh sách người dùng.',
            err: error.message
        });
    }
}

module.exports.detail = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const user = await User.detail(id);
        if (user) {
            res.json({
                code: 200,
                user
            });
        } else {
            res.json({
                code: 404,
                message: 'Không tìm thấy người dùng.'
            });
        }
    } catch (error) {
        res.json({
            code: 400,
            message: 'Lỗi khi lấy thông tin người dùng.',
            err: error.message
        });
    }
}

module.exports.create = async (req, res) => {
    try {
        const data = req.body;
        const result = await User.create(data);
        res.json({
            code: 200,
            message: result.message
        });
    } catch (error) {
        res.json({
            code: 400,
            message: 'Lỗi khi tạo người dùng.',
            err: error.message
        });
    }
}

module.exports.edit = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const data = req.body;
        const result = await User.update(id, data);
        res.json({
            code: 200,
            message: result.message
        });
    } catch (error) {
        res.json({
            code: 400,
            message: 'Lỗi khi cập nhật người dùng.',
            err: error.message
        });
    }
}

module.exports.delete = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const result = await User.delete(id);
        res.json({
            code: 200,
            message: result.message
        });
    } catch (error) {
        res.json({
            code: 400,
            message: 'Lỗi khi xóa người dùng.',
            err: error.message
        });
    }
};

module.exports.loginGoogle = (req, res) => {
    try {
        console.log("Client Id: ", process.env.GOOGLE_CLIENT_ID);
        const url = client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
            redirect_uri: process.env.GOOGLE_REDIRECT_URI
        });
        console.log('Generated Auth URL:', url);
        res.redirect(url);
    } catch (error) {
        console.error('Error in loginGoogle:', error);
        res.status(400).json({
            code: 400,
            message: "Login fail!",
            error: error.message,
        });
    }
};

module.exports.callback = async (req, res) => {
    try {
        const { code } = req.query;
        console.log('Code:', code); // Log the code to ensure it is being received
        if (!code) {
            return res.status(400).json({
                error: 'Code is missing from query parameters'
            });
        }

        const { tokens } = await client.getToken({
            code,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI
        });
        client.setCredentials(tokens);

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        const user = await User.findOne({
            googleId: payload.sub,
        });

        let newUser;
        if (!user) {
            newUser = await User.create({
                id: generateRandomString(22),
                googleId: payload.sub,
                email: payload.email,
                username: payload.name,
                picture: payload.picture,
                games: [] // Đảm bảo rằng không có trường games
            });
        } else {
            newUser = user;
        }
        console.log("Tạo user thành công", newUser);

        res.cookie('token', tokens.id_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });
        console.log('User token:', tokens.id_token);
        res.redirect(redirectUrl); // Redirect to the profile page on your deployment
    } catch (error) {
        console.error('Error in callback:', error);
        res.status(400).json({
            code: 400,
            message: "Callback fail!",
            error: error.message,
        });
    }
};

module.exports.profile = async (req, res) => {
    console.log('Profile endpoint hit');
    try {
        if (!req.cookies) {
            console.error('No cookies found in request');
            return res.status(401).send('Unauthorized');
        }

        const token = req.cookies.token;
        console.log('Received Token:', token); // Log the token
        if (!token) {
            console.error('No token found in request cookies');
            return res.status(401).send('Unauthorized');
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log('Verified Payload:', payload); // Log the payload

        // Fetch user from database using Google ID
        const user = await User.findOne({
            googleId: payload.sub
        });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: "User not found",
            });
        }
        console.log(user);
        res.status(200).json({
            code: 200,
            message: "Get user profile success!",
            data: user,
        });
    } catch (error) {
        console.error('Error in profile:', error); // Log the error
        res.status(400).json({
            code: 400,
            message: "Get user profile fail!",
            error: error.message,
        });
    }
};

module.exports.logout = (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        // Respond with a success message
        res.status(200).json({
            code: 200,
            message: "Logout success!"
        });
    } catch (error) {
        console.error('Error in logout:', error);
        res.status(400).json({
            code: 400,
            message: "Logout fail",
            error: error.message,
        });
    }
};