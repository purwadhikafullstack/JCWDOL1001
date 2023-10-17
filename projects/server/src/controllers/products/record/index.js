const {Product_History, Product_Detail, Product_Unit} = require("../../../model/product.js")
const { Op } = require("sequelize");
const moment = require("moment");

const productHistory = async(req, res, next) => {
    try{
        const productId = req.params
        const {page, sort_status, sort_type, start_date, end_date} = req.query;
        const currentPage = page ? parseInt(page) : 1;

        const options = {
            offset : currentPage > 1 ? parseInt(currentPage - 1)*20 : 0,
            limit : 20
        }

        let formattedStartDate, formattedEndDate;
        if(start_date && end_date){
            formattedStartDate = moment(start_date).startOf("day").toDate();
            formattedEndDate = moment(end_date).endOf("day").toDate();
        }
        else{
            formattedStartDate = moment("2023-01-01").startOf("day").toDate();
            formattedEndDate = moment().endOf("day").toDate();
        }

        let sort = [];
        if (sort_status) sort.push([`status`,sort_status]);
        if (sort_type) sort.push(['type',sort_type]);

        const unitHistory = await Product_History.findAll({
            ...options,
            where : {[Op.and] : productId, 
                createdAt : {[Op.between] : [formattedStartDate, formattedEndDate]}
            },
        order : sort,})

        const total = await Product_History?.count({ where : productId});
        const pages = Math.ceil(total / options.limit);

        res.status(200).json({
            type : "success",
            message : "History Get",
            currentPage : +page ? +page : 1,
            totalPage : pages,
            totalRecord : total,
            data : unitHistory,
        })
    }catch(error){
        next(error)
    }
}

const initialStock = async(req, res, next) => {
    try{
        const productId = req.params
        const unitHistoryHelper = await Product_Detail.findAll({
            include : {
                model : Product_Unit,
                as : "product_unit"
            },
            where : {[Op.and] : productId, isDeleted : false}})
        res.status(200).json({
            type : "success",
            message : "initial Stock Get",
            data : unitHistoryHelper
        })
    }catch(error){
        next(error)
    }
}

module.exports = {
    productHistory,
    initialStock
}