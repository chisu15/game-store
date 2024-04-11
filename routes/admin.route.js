const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.controller');

router.get('/', controller.listAdmin);
// router.get('/:id', controller.profile);
// router.post('/create', controller.create);
// router.patch('/edit/:id', controller.edit);
// router.delete('/delete/:id', controller.delete);
// router.patch('/changeMulti/', controller.changeMulti)
module.exports = router;