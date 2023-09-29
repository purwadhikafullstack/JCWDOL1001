const {middlewareErrorHandling} = require("../../../middleware/index.js")
const {Product_History} = require("../../../model/product.js")
const { Op } = require("sequelize");
const moment = require("moment");

const productHistory = async(req, res, next) => {
    try{
        const productId = req.params
        console.log(productId)
        const {page, sort_status, start_date, end_date} = req.query;
        const currentPage = page ? parseInt(page) : 1;

        const options = {
            offset : currentPage > 1 ? parseInt(currentPage - 1)*20 : 0,
            limit : 20
        }

        let formattedStartDate, formattedEndDate;
        formattedStartDate = moment(start_date).startOf("day").toDate();
        formattedEndDate = moment(end_date).endOf("day").toDate();

        let sort = [];
        if (sort_status) sort.push([`createdAt`,sort_status]);

        const unitHistory = await Product_History.findAll({
            ...options,
            where : {[Op.and] : productId, createdAt : {[Op.between] : [formattedStartDate, formattedEndDate]}},
        order : sort,})

        const total = await Product_History?.count({ where : productId});
        const pages = Math.ceil(total / options.limit);

        res.status(200).json({
            type : "success",
            message : "History Get",
            currentPage : +page ? +page : 1,
            totalPage : pages,
            totalRecord : total,
            data : unitHistory
        })
    }catch(error){
        next(error)
    }
}

module.exports = {
    productHistory
}