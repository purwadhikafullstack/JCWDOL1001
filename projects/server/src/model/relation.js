const { User_Account, User_Profile, User_Address, User_Role, User_Status } = require("./user.js")

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


export { User_Account, User_Profile, User_Address, User_Role, User_Status  }