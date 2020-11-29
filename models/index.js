const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./users')(sequelize, Sequelize);
db.Friend = require('./friends')(sequelize, Sequelize);
db.Request = require('./requests')(sequelize, Sequelize);
db.Room = require('./rooms')(sequelize, Sequelize);


db.Request.belongsTo(db.User, { as: 'requester' });

db.Friend.belongsTo(db.User, { as: 'requester' });



module.exports = db;