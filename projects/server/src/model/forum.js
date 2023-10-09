const db = require("./index.js")

const Forum = db.sequelize.define("forum", {
    qnaId : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    question : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    adminId : {
        type : db.Sequelize.INTEGER,
        allowNull : true
    },
    answer : {
        type : db.Sequelize.STRING,
        allowNull : true
    },
    isDeleted : {
        type : db.Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : 0
    },
    expiredDate : {
        type : db.Sequelize.DATE,
        allowNull : true,
    }
})

module.exports = { 
  Forum
}