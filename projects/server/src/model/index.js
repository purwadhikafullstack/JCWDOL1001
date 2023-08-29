const config = require("../config/index.js");
const Sequelize = require("sequelize");

// @create suequlize connection
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
