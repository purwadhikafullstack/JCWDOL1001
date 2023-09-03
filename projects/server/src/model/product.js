const db = require("./index.js")

const Product_List = db.sequelize.define("product_list", {
    productId : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    productName : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    isDeleted : {
        type : db.Sequelize.INTEGER,
        allowNull : false,
        defaultValue : 0
    },
    productPicture : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    productPrice : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    productDosage : {
        type : db.Sequelize.STRING,
        allowNull : true
    },
    productDescription : {
        type : db.Sequelize.STRING,
        allowNull : true
    },
},{
    timestamps: false
});

const Product_Category = db.sequelize.define("product_category", {
    productCategoryId : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    productId : {
        type: db.Sequelize.INTEGER,
        allowNull: false
    },
    categoryId : {
        type: db.Sequelize.INTEGER,
        allowNull: false
    },
},{
    timestamps: false
});

module.exports = { 
  Product_List,
  Product_Category
}