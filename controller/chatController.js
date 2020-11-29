const { Room, User } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { userService } = require('../service');


module.exports = {
    getRooms: async (req, res) => {
        try {
            const rooms = await Room.findAll({});
            const allRooms = rooms.map(data => data.get({ plain: true }));
            return res.status(200).render('room', { allRooms });
        } catch (error) {

            return res.status(500).redirect('rooms');
        }
    },
    getChat: async (req, res) => {
        try {
            const user = req.decoded;
            const roomNum = req.query.roomId;
            const room = await Room.findOne({
                where: {
                    id: roomNum
                }
            })
            const roomInfo = room.get({ plain: true });
            const userDb = await User.findOne({
                where: {
                    id: user.id
                },
                attributes: ['id', 'userId']
            })
            const userInfo = userDb.get({ plain: true });
            return res.status(200).render('chat', { roomInfo, userInfo });
        } catch (error) {

            return res.status(500).redirect('rooms');
        }
    },
    getDM: async (req, res) => {
        try {
            const user = req.decoded;
            const friendId = req.query.frienduserId;

            return res.status(200).render('dm', { userId: user.userId, friendId });
        } catch (error) {

            return res.status(500).redirect('/friend/list');
        }
    }
}