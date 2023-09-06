const { User_Account, User_Profile, User_Address, User_Role, User_Status } = require("./user.js")
const { Product_List, Product_Category, Product_Unit, Product_Detail } = require("./product.js")

// @define relation
//acc-address, one to many
User_Account.hasMany(User_Address,{sourceKey : "userId", foreignKey : "userId"})
User_Address.belongsTo(User_Account, {targetKey : "userId", foreignKey : "userId"})
//role-account
User_Role.hasMany(User_Account,{sourceKey : "role", foreignKey : "role"})
User_Account.belongsTo(User_Role, {targetKey : "role", foreignKey : "role"})
//acc-profiles
User_Account.hasOne(User_Profile,{sourceKey : "userId", foreignKey : "userId"})
User_Profile.belongsTo(User_Account, {targetKey : "userId", foreignKey : "userId"})
//status-account
User_Status.hasMany(User_Account,{sourceKey : "status", foreignKey : "status"})
User_Account.belongsTo(User_Status, {targetKey : "status", foreignKey : "status"})

Product_List.belongsToMany(Product_Category, {
  through: "product_categories",
  foreignKey: "productId",
  otherKey: "categoryId",
  as: "ProductCategories"
});

Product_Category.belongsToMany(Product_List, {
  through: "product_categories",
  foreignKey: "categoryId",
  otherKey: "productId",
  as: "CategoriesProducts"
});

Product_List.belongsToMany(Product_Unit, { through : Product_Detail, foreignKey : "productId", otherKey: "unitId" })
Product_List.hasMany(Product_Detail,{foreignKey : "productId"})
Product_Detail.belongsTo(Product_List,{foreignKey : "productId"})

module.exports = { 
    User_Account, 
    User_Profile, 
    User_Address, 
    User_Role, 
    User_Status,
    Product_List,
    Product_Category, 
    Product_Unit,
    Product_Detail
}