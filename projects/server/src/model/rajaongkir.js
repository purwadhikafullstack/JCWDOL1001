const db = require("./index.js")

const Rajaongkir_Cities = db.sequelize.define("rajaongkir_city", {
    city_id : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false,
    },
    province_id : {
        type: db.Sequelize.INTEGER,
        allowNull : false
    },
    city_name : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    postal_code : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
},{
  timestamps: false
});

const Rajaongkir_Provinces = db.sequelize.define("rajaongkir_province", {
    province_id : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false,
    },
    province_name : {
        type: db.Sequelize.STRING,
        allowNull: true,
    },  
},{
  timestamps: false
});

const Rajaongkir_Subdistricts = db.sequelize.define("rajaongkir_subdistrict", {
    subdistrict_id : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false,
    },
    city_id : {
        type: db.Sequelize.INTEGER,
        allowNull: false,
    },
    subdistrict_name: {
        type : db.Sequelize.STRING,
        allowNull : false
    },
},{
  timestamps: false
});

module.exports = { 
    Rajaongkir_Cities, 
    Rajaongkir_Provinces, 
    Rajaongkir_Subdistricts, 
}