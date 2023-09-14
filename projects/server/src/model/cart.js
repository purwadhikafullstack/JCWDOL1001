const db = require("./index.js")

const Cart = db.sequelize.define("cart",{
    cartId : {
        type : db.Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    },
    userId : {
        type : db.Sequelize.INTEGER,
        allowNull : false,
    },
    productId : {
        type : db.Sequelize.INTEGER,
        allowNull : false,
    },
    quantity : {
        type : db.Sequelize.INTEGER,
        allowNull : false,
    },
    // isDeleted : {
    //     type : db.Sequelize.TINYINT,
    //     allowNull : false,
    // }
},{
    timestamps : false
});

module.exports = {
    Cart
}