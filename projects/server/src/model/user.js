const db = require("./index.js")

const User_Account = db.sequelize.define("user_account", {
    userId : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    UUID : {
        type: db.Sequelize.UUID,
        defaultValue: db.Sequelize.UUIDV4 
    },
    email : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    password : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    status : {
        type : db.Sequelize.INTEGER,
        allowNull : false,
        defaultValue : 0
    },
    role : {
        type : db.Sequelize.INTEGER,
        allowNull : false,
        defaultValue : 2
    },
    otp : {
        type : db.Sequelize.STRING,
        allowNull : true,
    },
    expiredOtp: {
        type : db.Sequelize.DATE,
        allowNull : true,
    },
    imgRecipe : {
        type : db.Sequelize.STRING,
        allowNull : true
    },
},{
  timestamps: false
});

const User_Profile = db.sequelize.define("user_profile", {
    profileId : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId : {
        type: db.Sequelize.INTEGER,
        allowNull: false,
    },
    name: {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    profilePicture : {
        type : db.Sequelize.STRING,
        allowNull : true
    },
    gender : {
        type : db.Sequelize.STRING,
        allowNull : true
    },
    birthdate: {
        type : db.Sequelize.DATEONLY,
        allowNull : true
    },
    phone : {
        type : db.Sequelize.STRING,
        allowNull : false
    }   
},{
  timestamps: false
});

const User_Address = db.sequelize.define("user_address", {
    addressId : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId : {
        type: db.Sequelize.INTEGER,
        allowNull: false,
    },
    address: {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    province : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    city : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    district: {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    postalCode: {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    contactPhone: {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    contactName: {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    isDeleted : {
        type : db.Sequelize.INTEGER,
        allowNull : false,
        defaultValue : 0
    },
    isPrimary : {
        type : db.Sequelize.INTEGER,
        allowNull : false,
        defaultValue : 0
    },
},{
  timestamps: false
});

const User_Role = db.sequelize.define("user_role", {
    role : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
    },
    roleDesc : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
   
},{
  timestamps: false
});

const User_Status = db.sequelize.define("user_status", {
    status : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    statusDesc : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
},{
  timestamps: false
});

module.exports = { 
    User_Account, 
    User_Profile, 
    User_Address, 
    User_Role, 
    User_Status  
}