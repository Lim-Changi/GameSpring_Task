const { User, Request, Friend } = require('../models');
const { userService } = require('../service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


module.exports = {
    //친구요청
    addfriendRequest: async (req, res) => {
        try {
            const user = req.decoded;
            const { hostId } = req.body;
            const alreadyRequest = await Request.findOne({
                where: {
                    requesterId: user.id, hostId
                }
            })
            if (alreadyRequest) {
                req.flash('error_message', '이미 친구요청하신 상대입니다');
                return res.status(500).render('실패');
            }
            const addFriend = await Request.create({
                requesterId: user.id, hostId
            });
            req.flash('success_message', '친구요청에 성공하셨습니다');
            res.status(200).render('성공');
        } catch (error) {
            console.log(error);
            req.flash('error_message', '친구요청에 실패하셨습니다');
            return res.status(500).render('실패');
        }
    },
    //친구요청 수락
    addfriend: async (req, res) => {
        try {
            const user = req.decoded;
            const { requestId } = req.body;
            const request = await Request.findOne({
                where: {
                    id: requestId
                }
            });
            const addFriend = await Friend.create({
                requesterId: request.requesterId,
                hostId: user.id
            });
            const finishRequest = await Request.destroy({
                where: {
                    id: requestId
                }
            })
            req.flash('success_message', '친구등록에 성공하셨습니다');
            res.status(200).render('성공');
        } catch (error) {
            console.log(error);
            req.flash('error_message', '친구등록에 실패하셨습니다');
            return res.status(500).render('실패');
        }
    },
    //친구요청 거절
    refuseRequest: async (req, res) => {
        try {
            const { requestId } = req.body;
            const refuse = await Request.destroy({
                where: {
                    id: requestId
                }
            })
            req.flash('success_message', '친구거절에 성공하셨습니다');
            res.status(200).render('성공');
        } catch (error) {
            console.log(error);
            req.flash('error_message', '친구거절에 실패하셨습니다');
            return res.status(500).render('실패');
        }
    },
    //친구요청목록
    getRequest: async (req, res) => {
        try {
            const user = req.decoded;
            const requests = await Request.findAll({
                where: {
                    hostId: user.id
                },
                include: [{
                    model: User,
                    as: 'requester',
                    attributes: ['id', 'userId', 'createdAt']
                }]
            });
            const allRequest = requests.map(data => data.get({ plain: true }));
            res.status(200).render('성공', { allRequest });

        } catch (error) {
            console.log(error);
            return res.status(500).render('실패');
        }
    },
    //친구목록
    getFriends: async (req, res) => {
        try {
            const user = req.decoded;
            const friends = await userService.getFriends(user);
            const getFriends = await User.findAll({
                where: {
                    id: {
                        [Op.in]: friends
                    }
                },
                attributes: ['id', 'userId', 'createdAt']
            });
            const allFriends = getFriends.map(data => data.get({ plain: true }))
            res.status(200).render('성공', { allFriends });

        } catch (error) {
            console.log(error);
            return res.status(500).render('실패');
        }
    },
    //친구 삭제
    deleteFriend: async (req, res) => {
        try {
            const user = req.decoded;
            const { friendId } = req.body;
            const deleteFriend = await Friend.destroy({
                where: {
                    [Op.or]: [
                        { [Op.and]: [{ hostId: user.id }, { requesterId: friendId }] },
                        { [Op.and]: [{ hostId: friendId }, { requesterId: user.id }] }
                    ]
                }
            })
            if (!deleteFriend) {
                return res.status(409).render('실패');
            }
            return res.status(200).render('성공');
        } catch (error) {
            console.log(error);
            return res.status(500).render('실패');
        }
    }
}