const db = require("./index.js")

const Categories = db.sequelize.define("categories",{
    categoryId : {
        type : db.Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    },
    categoryDesc : {
        type : db.Sequelize.STRING,
        allowNull : false,
    },
    categoryPicture : {
        type : db.Sequelize.STRING,
        allowNull : false,
    },
    isDeleted : {
        type : db.Sequelize.TINYINT,
        allowNull : false,
    }
},{
    timestamps : false
});

module.exports = {
    Categories
}