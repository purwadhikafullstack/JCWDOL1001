const db = require("./index.js")

const Discount = db.sequelize.define("discount", {
    discountId :{
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    discountDesc : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    discountName : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    discountCode : {
        type : db.Sequelize.STRING,
        allowNull : true
    },
    isPercentage : {
        type : db.Sequelize.BOOLEAN,
        defaultValue : 0,
        allowNull : false
    },
    discountAmount : {
        type : db.Sequelize.INTEGER,
        allowNull : true
    },
    discountExpired : {
        type : db.Sequelize.DATE,
        allowNull : true
    },
    oneGetOne : {
        type : db.Sequelize.BOOLEAN,
        defaultValue : 0,
        allowNull : false
    },
    minimalTransaction : {
        type : db.Sequelize.INTEGER,
        allowNull : true
    },
    isDeleted : {
        type : db.Sequelize.BOOLEAN,
        defaultValue : 0,
        allowNull : false
    }
},{
    timestamps:false
})

const Discount_Transaction = db.sequelize.define("discount_transaction", {
    productListId :{
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    discountId : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    transactionId : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    }
},{
    timestamps:false
})

const Discount_Product = db.sequelize.define("discount_product", {
    discountProductId :{
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    discountId : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    productId : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    endingPrice : {
        type : db.Sequelize.INTEGER,
        allowNull : true
    },
    isDeleted : {
        type : db.Sequelize.TINYINT,
        allowNull : true
    }
},{
    timestamps:false
})

module.exports = { 
  Discount,
  Discount_Transaction,
  Discount_Product
}