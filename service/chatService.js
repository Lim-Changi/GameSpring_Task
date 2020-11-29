const { User, Room } = require('../models');


module.exports = {
    addUser: async (roomNum) => {
        try {
            const users = await Room.findOne({
                where: {
                    id: roomNum
                },
                attributes: ['users']
            });
            const usersCount = users.get({ plain: true });
            const addUser = usersCount.users + 1
            const newUserNum = await Room.update({
                users: addUser
            }, {
                where: {
                    id: roomNum
                }
            })
        } catch (err) {
            throw err;
        }
    },
    reduceUser: async (roomNum) => {
        try {
            const users = await Room.findOne({
                where: {
                    id: roomNum
                },
                attribute: ['users']
            });
            const usersCount = users.get({ plain: true });
            const reduceUser = usersCount.users - 1
            const newUserNum = await Room.update({
                users: reduceUser
            }, {
                where: {
                    id: roomNum
                }
            })
        } catch (err) {
            throw err;
        }
    }

}