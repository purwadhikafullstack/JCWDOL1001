const Axios = require("axios");
const path = require("path")
const fs = require("fs")
const {middlewareErrorHandling} = require("../../middleware/index.js");

const { InputAddressValidationSchema } = require("./validation.js")
const { User_Address, Rajaongkir_Provinces, Rajaongkir_Cities, Rajaongkir_Subdistricts } = require("../../model/relation.js");
const { Op } = require("sequelize");
const { capitalizeEachWords, trimString } = require("../../utils/index.js");

const getAddress = async (req, res, next) =>{
    try {
        const userId = req.user.userId
        
        const addresses = await User_Address.findAll({where: { userId, isDeleted : 0 }, order:[["isPrimary" , "DESC"]]})

        if (!addresses) {
            throw new Error(middlewareErrorHandling.ADDRESS_NOT_FOUND);
        }

        res.status(200).json({ 
            message : "Address fetched!",
            data: addresses
        })
    } catch (error) {
        next(error)
    }
}

const addAddress = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const {
            address,
            province,
            city,
            district,
            postalCode,
            contactPhone,
            contactName,
        } = req.body;

        const existingAddresses = await User_Address.findAll({ where: { userId } });

        const isPrimary = existingAddresses.length === 0 ? 1 : 0;

        const addressData = {
            userId,
            address : capitalizeEachWords(trimString(address)),
            province,
            city,
            district : capitalizeEachWords(trimString(district)),
            postalCode,
            contactPhone,
            contactName : capitalizeEachWords(trimString(contactName)),
            isPrimary,
        };

        await InputAddressValidationSchema.validate(addressData);

        const newAddress = await User_Address.create(addressData);

        res.status(200).json({
            message: 'Address created successfully!',
            data: newAddress,
        });
    } catch (error) {
    next(error);
    }
};


const updateAddress = async (req, res, next) =>{
    try {
        const { userId } = req.user;
        const { addressId } = req.params;
        const {
            address,
            province,
            city,
            district,
            postalCode,
            contactPhone,
            contactName,
        } = req.body;

        const addressExists = await User_Address.findOne({
            where : {[Op.and] : [{ addressId }, { userId }]},
        })

        if (!addressExists) {
            throw new Error(middlewareErrorHandling.ADDRESS_NOT_FOUND);
        }

        const addressData = {
            address : capitalizeEachWords(trimString(address)),
            province,
            city,
            district : capitalizeEachWords(trimString(district)),
            postalCode,
            contactPhone,
            contactName : capitalizeEachWords(trimString(contactName)),
        }

        await InputAddressValidationSchema.validate(addressData);

        const updatedAddress = await addressExists.update(addressData)
        
        res.status(200).json({ 
            message : "Address updated successfully!",
            data: updatedAddress
        })
    } catch (error) {
        next(error)
    }
}

const updatePrimaryAddress = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { addressId } = req.params;

        const primaryAddress = await User_Address.findOne({where : { userId, isPrimary : 1 }})

        if (!primaryAddress) {
            throw new Error(middlewareErrorHandling.ADDRESS_NOT_FOUND);
        }
        
        const newPrimaryAddress = await User_Address.findOne({where : { userId, addressId }})
        
        if (!newPrimaryAddress) {
            throw new Error(middlewareErrorHandling.ADDRESS_NOT_FOUND);
        }

        if (primaryAddress.dataValues?.addressId === +addressId) {
            throw new Error("No changes were made!");
        }
        
        await primaryAddress.update({ isPrimary : 0 })
        await newPrimaryAddress.update({ isPrimary : 1 })
        

        res.status(200).json({ 
            message : "Primary address updated successfully!",
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

        if (addressExists.dataValues?.isPrimary === 1) {
            throw new Error("Primary address cannot be deleted!");
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
        
        const provinces = await Rajaongkir_Provinces.findAll()

        res.status(200).json({ 
            message : "Data Provinces from RajaOngkir",
            data: provinces
        })
    } catch (error) {
        next(error)
    }
}

const getListCity = async (req, res, next) => {
    try {
        const { province } = req.query
        const cities = await Rajaongkir_Cities.findAll({where : { province_id : province}})

        res.status(200).json({ 
            message : "Data Cities based on Province from RajaOngkir",
            data: cities
        })
    } catch (error) {
        next(error)
    }
}

const shippingCost = async (req, res, next) => {
    try {

        const {data:{rajaongkir:{results}}} = await Axios.post(process.env.REACT_APP_RAJAONGKIR_API_BASE_URL_COST,
            { 
                key : process.env.REACT_APP_RAJAONGKIR_API_KEY, 
                origin: 151, 
                destination: req.body.destination, 
                weight: req.body.weight, 
                courier: req.body.courier
            }
        )

        res.status(200).json({ 
            type : "success",
            message : "Data berhasil dimuat",
            data : results
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAddress,
    addAddress,
    updateAddress,
    updatePrimaryAddress,
    deleteAddress,
    getListProvince,
    getListCity,
    shippingCost,
 }