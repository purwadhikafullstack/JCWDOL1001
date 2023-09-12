const Axios = require("axios");
const path = require("path")
const fs = require("fs")


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
    getListProvince,
    getListCity,
    getCost
 }