const express = require('express');
const router = express.Router();
const userController = require('../../controller/userController');
const chatController = require('../../controller/chatController');

router.get('/users', userController.getAllUser);
router.get('/logout', userController.logout);
router.get('/rooms', chatController.getRooms);
router.get('/chat', chatController.getChat);
router.get('/dm', chatController.getDM);

module.exports = router;

