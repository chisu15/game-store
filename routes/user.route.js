const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

router.get('/', controller.index);
router.get('/profile', controller.profile);
router.post("/logout", controller.logout);
router.get('/auth/loginGoogle', controller.loginGoogle);
router.get('/auth/callback', controller.callback);
router.patch('/edit/:id', controller.edit);
module.exports = router;