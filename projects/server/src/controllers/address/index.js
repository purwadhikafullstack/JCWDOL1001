const Axios = require("axios");
const path = require("path")
const fs = require("fs")
const {middlewareErrorHandling} = require("../../middleware/index.js");

const { User_Address } = require("../../model/relation.js");
const { Op } = require("sequelize");

const getAddress = async (req, res, next) =>{
    try {
        const userId = req.user.userId
        
        const address = await User_Address.findAll({where: { userId }})

        if (!address) {
            throw new Error(middlewareErrorHandling.ADDRESS_NOT_FOUND);
        }

        res.status(200).json({ 
            message : "Address fetched!",
            data: address
        })
    } catch (error) {
        next(error)
    }
}

const deleteAddress = async (req, res, next) =>{
    try {
        const addressId = req.params.addressId
        const userId = req.user.userId
        
        const addressExists = await User_Address.findOne({
            where : {[Op.and] : [{ addressId }, { userId }]},
        })

        if (!addressExists) {
            throw new Error(middlewareErrorHandling.ADDRESS_NOT_FOUND);
        }

        await addressExists.update({ isDeleted: 1 });

        res.status(200).json({ 
            message : "Address Deleted!",
        })
    } catch (error) {
        next(error)
    }
}

const getListProvince = async (req, res, next) => {
    try {
        
        const response = await Axios.get(process.env.REACT_APP_RAJAONGKIR_API_BASE_URL + "province",
        { 
            headers : 
            {
                "key" : process.env.REACT_APP_RAJAONGKIR_API_KEY, 
                "Content-Type": "application/x-www-form-urlencoded"
        }
        }
        )
        const {data} = response;
        const {rajaongkir} = data
        res.status(200).json({ 
            message : "Data Province from RajaOngkir",
            data: rajaongkir.results
        })
    } catch (error) {
        next(error)
    }
}
const getListCity = async (req, res, next) => {
    try {
        const {province} = req.query
        const response = await Axios.get(process.env.REACT_APP_RAJAONGKIR_API_BASE_URL + 
            `city?province=${province}`,
        { 
            headers : 
            {
                "key" : process.env.REACT_APP_RAJAONGKIR_API_KEY, 
                "Content-Type": "application/x-www-form-urlencoded"
        }
    })

    const {data} = response;
    const {rajaongkir} = data
    res.status(200).json({ 
        message : "Data City based on Province from RajaOngkir",
        data: rajaongkir.results
    })
    } catch (error) {
        next(error)
    }
}

const getCost = async (req, res, next) => {
    try {
        const {province} = req.params
        const response = await Axios.get(process.env.REACT_APP_RAJAONGKIR_API_BASE_URL + 
            `city?province=${province}`,
        { 
            headers : 
            {
                "key" : process.env.REACT_APP_RAJAONGKIR_API_KEY, 
                "Content-Type": "application/x-www-form-urlencoded"
        }
    })

        res.status(200).json({ 
            type : "success",
            message : "Data berhasil dimuat",
            data : response
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAddress,
    deleteAddress,
    getListProvince,
    getListCity,
    getCost,
 }