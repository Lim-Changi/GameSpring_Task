const { Friend } = require('../models');


module.exports = {
    getFriends: async (user) => {
        try {
            const myFriends = await Friend.findAll({
                where: {
                    hostId: user.id
                },
                attributes: ['requesterId'],

            });
            const othersFriend = await Friend.findAll({
                where: {
                    requesterId: user.id
                },
                attributes: ['hostId']
            });
            const myFriendsId = myFriends.map(data => data.get('requesterId'))
            const othersFriendId = othersFriend.map(data => data.get('hostId'))
            const friendsId = myFriendsId.concat(othersFriendId);
            return friendsId;
        } catch (err) {
            throw err;
        }
    },

}