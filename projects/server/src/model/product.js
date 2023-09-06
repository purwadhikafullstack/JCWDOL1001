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

const Product_Unit = db.sequelize.define("product_unit", {
    unitId : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name : {
        type: db.Sequelize.STRING,
        allowNull: false
    }
},{
    timestamps: false
});

const Product_Detail = db.sequelize.define("product_detail", {
    stockId : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    productId : {
        type: db.Sequelize.INTEGER,
        allowNull: false
    },
    unitId : {
        type: db.Sequelize.INTEGER,
        allowNull: false
    },
    quantity : {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    isDefault : {
        type: db.Sequelize.BOOLEAN,
        allowNull: false
    },
    isDeleted : {
        type: db.Sequelize.BOOLEAN,
        allowNull: false
    }
},{
    timestamps: false
});

module.exports = { 
  Product_List,
  Product_Category,
  Product_Unit,
  Product_Detail
}