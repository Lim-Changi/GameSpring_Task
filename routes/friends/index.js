const express = require('express');
const router = express.Router();
const friendController = require('../../controller/friendController');

router.post('/addrequest', friendController.addfriendRequest);
router.post('/addfriend', friendController.addfriend);
router.delete('/refuserequest', friendController.refuseRequest);
router.get('/requests', friendController.getRequest);
router.get('/list', friendController.getFriends);
router.delete('/deletefriend', friendController.deleteFriend);

module.exports = router;