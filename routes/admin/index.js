const express = require('express');
const router = express.Router();
const userController = require('../../controller/userController');

router.get('/rooms', (req, res) => {
    res.render('room');
})
router.get('/users', userController.getAllUser);
router.get('/logout', userController.logout);

module.exports = router;

