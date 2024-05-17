const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.controller');

router.get('/', controller.index);
router.get('/:id', controller.detail);
router.post('/', controller.create);
router.patch('/edit/:id', controller.edit);
router.delete('/:id', controller.delete);
router.post('/login', controller.login)
module.exports = router;