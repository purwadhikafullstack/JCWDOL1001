const { User_Account, User_Profile, User_Address, User_Role, User_Status } = require("./user.js")
const { Product_List, Product_Category, Product_Unit, Product_Detail,Product_History } = require("./product.js")
const { Categories } = require("./category.js")
const { Transaction_List, Transaction_Detail, Transaction_Status } = require("./transaction.js")

// @define relation
//acc-address, one to many
User_Account.hasMany(User_Address,{sourceKey : "userId", foreignKey : "userId"})
User_Address.belongsTo(User_Account, {targetKey : "userId", foreignKey : "userId"})
//role-account
User_Role.hasMany(User_Account,{sourceKey : "role", foreignKey : "role"})
User_Account.belongsTo(User_Role, {targetKey : "role", foreignKey : "role"})
//acc-profiles
User_Account.hasOne(User_Profile,{sourceKey : "userId", foreignKey : "userId", as :"userProfile"})
User_Profile.belongsTo(User_Account, {targetKey : "userId", foreignKey : "userId"})
//status-account
User_Status.hasMany(User_Account,{sourceKey : "status", foreignKey : "status"})
User_Account.belongsTo(User_Status, {targetKey : "status", foreignKey : "status"})


Product_List.belongsToMany(Categories, {
    through: Product_Category,
    foreignKey: "productId",
    otherKey: "categoryId",
    as: "productCategories"
});

Product_List.hasMany(Product_Category, { foreignKey: "productId"});

Product_Category.belongsTo(Product_List, {
    // through: "product_categories",
    foreignKey: "productId",
    // otherKey: "productId",
    as: "CategoriesProducts"
});

Categories.hasMany(Product_Category,{foreignKey: "categoryId"})
Product_Category.belongsTo(Categories,{foreignKey:"categoryId"})

Product_List.belongsToMany(Product_Unit, { through : Product_Detail, foreignKey : "productId", otherKey: "unitId", as: "productUnits"})
Product_List.hasMany(Product_Detail,{foreignKey : "productId"})
Product_Detail.belongsTo(Product_List,{foreignKey : "productId",as: "productList"})

Product_Unit.belongsToMany(Product_List, { through : Product_Detail, foreignKey : "productId", otherKey: "unitId", as: "productDetails"})
Product_Unit.hasMany(Product_Detail,{foreignKey : "unitId"})
Product_Detail.belongsTo(Product_Unit,{foreignKey : "unitId"})

Product_Detail.hasMany(Product_History,{sourceKey : "productId", foreignKey : "productId"})
Product_History.belongsTo(Product_Detail, {targetKey : "productId", foreignKey : "productId"})

User_Account.hasMany(Transaction_List,{foreignKey : "userId", otherKey:"statusId"})
Transaction_List.belongsTo(User_Account, {foreignKey : "userId"})

Transaction_Status.hasMany(Transaction_List,{foreignKey : "statusId", otherKey:"userId"})
Transaction_List.belongsTo(Transaction_Status,{foreignKey:"statusId", as: "transactionStatus"})

Transaction_List.belongsToMany(Product_Detail, {through : Transaction_Detail, foreignKey : "transactionId", otherKey : "productId"})
Transaction_List.hasMany(Transaction_Detail, {foreignKey : "transactionId",as : "transactionDetail"})
Transaction_Detail.belongsTo(Transaction_List, {foreignKey : "transactionId"})

Product_Detail.hasMany(Transaction_Detail,{foreignKey : "productId", otherKey:"transactionId"})
Transaction_Detail.belongsTo(Product_Detail,{foreignKey : "productId", otherKey:"unitId",as: "productDetail"})

module.exports = { 
    User_Account, 
    User_Profile, 
    User_Address, 
    User_Role, 
    User_Status,
    Product_List,
    Product_Category, 
    Product_Unit,
    Product_Detail,
    Product_History,
    Categories,
    Transaction_List,
    Transaction_Detail,
    Transaction_Status
}