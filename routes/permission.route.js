// git commit -m "Add Permission model, route, controller"

const express = require('express');
const router = express.Router();
const controller = require('../controllers/permission.controller');

router.get('/', controller.index);
router.get('/:id', controller.detail);
router.post('/', controller.create);
router.patch('/:id', controller.edit);
router.delete('/:id', controller.delete);
router.patch('/', controller.changeMulti)
module.exports = router;