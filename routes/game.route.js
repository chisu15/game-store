const express = require('express');
const router = express.Router();
const controller = require('../controllers/game.controller');

router.get('/', controller.index);
router.get('/:id', controller.detail);
router.post('/create', controller.create);
router.patch('/edit/:id', controller.edit);
router.delete('/delete/:id', controller.delete);
router.patch('/changeMulti/', controller.changeMulti)
module.exports = router;