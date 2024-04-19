const express = require('express');
const router = express.Router();
const controller = require('../controllers/gameCategory.controller');

router.get('/', controller.index);
router.get('/:id', controller.detail);
router.post('/', controller.create);
router.patch('/:id', controller.edit);
router.delete('/:id', controller.delete);
module.exports = router;