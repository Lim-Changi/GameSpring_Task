const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');



const { sequelize } = require('./models');
sequelize.sync({ alter: true })
  .then(() => {

  })
  .catch((err) => {

  })

const app = express();


// view engine setup
const { generateTime } = require('./helpers/handlebars-helpers');
app.engine('handlebars', exphbs({ helpers: { generateTime: generateTime } }));
app.set('view engine', 'handlebars');



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'Changi',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  next();
})
app.use(methodOverride('_method'));

app.use('/', require('./routes/index'));


// Socket.IO

socketServer = require('socket.io')();
const { chatService } = require('./service');


socketServer.on('connection', async (socket) => {

  var roomId;
  var disconnetUser = [];

  socket.on('disconnect', async () => {

    socket.broadcast.emit('leave', { userId: disconnetUser[0] })
    await chatService.reduceUser(roomId);
  });
  socket.on('client roomNum', async (roomNum) => {
    roomId = roomNum.roomNum;
    socket.on('client roomUsers', async (roomUsers) => {
      socket.on('client userId', async (userId) => {
        disconnetUser[0] = userId.userId;
        socketServer.emit('server info', {
          roomNum: roomNum.roomNum,
          roomUsers: roomUsers.roomUsers,
          userId: userId.userId
        })
        await chatService.addUser(roomNum.roomNum);
      })
    })
  })
  socket.on('client chatId', (chatId) => {
    socket.on('client message', (msg) => {
      socketServer.emit('server message', {
        message: msg.message, chatId: chatId.chatId
      });
    });
  });
  socket.on('dm userId', (userId) => {
    socket.on('dm message', (msg) => {
      socketServer.emit('dm message', {
        message: msg.message, userId: userId.userId
      })
    })
  });
  socket.on('dm userInfo', (userId) => {
    socketServer.emit('dm start', {
      userId: userId.userId
    })
  })


});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  res.render('error');
});

module.exports = app;
