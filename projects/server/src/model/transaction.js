const db = require("./index.js")

const Transaction_List = db.sequelize.define("transaction_list", {
    transactionId :{
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    addressId : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    total : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    transport : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    discount : {
        type : db.Sequelize.INTEGER,
        allowNull : true
    },
    subtotal : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    paymentProof : {
        type : db.Sequelize.STRING,
        allowNull : true
    },
    statusId : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    canceledBy : {
        type : db.Sequelize.STRING,
        allowNull : true
    },
    message : {
        type : db.Sequelize.STRING,
        allowNull : true
    },
    invoice : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    expired : {
        type : db.Sequelize.DATE,
        allowNull : true
    },
},{
    timestamps:true
})

const Transaction_Detail = db.sequelize.define("transaction_detail", {
    detailId :{
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    transactionId :{
        type: db.Sequelize.INTEGER,
        allowNull : false
    },
    price : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    quantity : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    totalPrice : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    productId : {
        type : db.Sequelize.STRING,
        allowNull : true
    },
    buyOneGetOne : {
        type : db.Sequelize.INTEGER,
        allowNull : false,
        defaultValue: 0
    },
},{
    timestamps:false
})

const Transaction_Status = db.sequelize.define("transaction_status", {
    statusId :{
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    statusDesc :{
        type: db.Sequelize.STRING,
        allowNull : false
    },
},{
    timestamps:false
})

module.exports = { 
  Transaction_List,
  Transaction_Detail,
  Transaction_Status
}