const express = require('express');
const router = express.Router();
const controller = require('../controllers/game.controller');

router.get('/', controller.index);
router.get('/:id', controller.detail);
router.post('/', controller.create);
router.patch('/:id', controller.edit);
router.delete('/:id', controller.delete);
router.patch('/', controller.changeMulti)
module.exports = router;