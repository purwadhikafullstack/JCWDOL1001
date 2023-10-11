const Sequelize = require("sequelize")
const {db_config} = require("../config/index.js")
const config = db_config['development']

// @create suequlize connection
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db
