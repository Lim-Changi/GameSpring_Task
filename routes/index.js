const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

// API
router.use('/user', require('./users'));
router.use('/friend', verifyToken.checkToken, require('./friends'));
router.use('/admin', verifyToken.checkToken, require('./admin'));

// MainPage rendering
router.get('/signup', (req, res) => {
  res.render('signup');
})
router.get('/', (req, res) => {
  res.render('main');
});


module.exports = router;
