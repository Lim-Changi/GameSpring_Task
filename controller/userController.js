const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('../modules/jwt');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { userService } = require('../service');
const { countFriends } = require('../service/userService');


module.exports = {
    //회원가입
    signup: async (req, res) => {
        try {
            const { userId, password } = req.body;
            const alreadyEmail = await User.findOne({
                where: {
                    userId
                }
            })
            if (alreadyEmail) {
                req.flash('error_message', '이미 존재하는 아이디입니다');
                res.status(409).redirect('/signup')
            }
            const salt = await bcrypt.genSalt(10);
            const hashedpw = await bcrypt.hash(password, salt);
            const user = await User.create({
                userId, password: hashedpw
            })
            req.flash('success_message', '회원가입에 성공하셨습니다');
            return res.status(201).redirect('/');

        } catch (err) {
            req.flash('error_message', '회원가입에 실패하셨습니다');
            console.log(err);
            return res.status(500).redirect('/signup');
        }

    },
    //로그인
    signin: async (req, res) => {
        try {
            const { userId, password } = req.body;
            const Id = await User.findOne({
                where: {
                    userId
                }
            });
            if (!Id) {
                req.flash('error_message', '존재하지 않는 아이디입니다');
                return res.status(409).redirect('/');
            }
            const checkPw = await bcrypt.compare(password, Id.password);
            if (checkPw !== true) {
                req.flash('error_message', '비밀번호가 일치하지 않습니다');
                return res.status(409).redirect('/');
            }
            const token = await jwt.sign(Id);
            res.cookie('authorization', 'Bearer ' + token);
            req.flash('success_message', '로그인에 성공하셨습니다');
            res.status(200).redirect('/admin/rooms');
        } catch (error) {
            console.log(error);
            req.flash('error_message', '로그인에 실패하셨습니다');
            return res.status(500).redirect('/');
        }
    },
    //모든 유저 조회
    getAllUser: async (req, res) => {
        try {
            const user = req.decoded;
            const rawUsers = await User.findAll({
                where: {
                    id: {
                        [Op.ne]: user.id
                    }
                },
                attributes: ['id', 'userId', 'createdAt']
            })
            const users = rawUsers.map(data => data.get({ plain: true }));
            let i = 0;
            for (i; i < users.length; i++) {
                let friends = await userService.getFriends(users[i]);
                let count = friends.length;
                users[i].friends = count;
                users[i].myFriend = friends.includes(user.id);
            }
            console.log(users);
            res.status(200).render('user', { users });

        } catch (error) {
            console.log(error);
            res.status(500).render(error);
        }
    },
    //로그아웃
    logout: async (req, res) => {
        try {
            res.clearCookie('authorization');
            return res.status(200).redirect('/')

        } catch (error) {
            console.log(error);
            return res.status(500).redirect('/rooms')
        }
    }
}