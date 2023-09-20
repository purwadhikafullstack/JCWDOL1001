const { Transaction_List, Transaction_Detail, Transaction_Status } = require("../../model/transaction");
const { Cart } = require("../../model/cart.js")
const { Op } = require("sequelize");
const { Product_Detail, Product_List } = require("../../model/product");

const getTransactions = async (req, res, next) => {
    try{
    const { userId } = req.user;
    const { statusId } = req.params;

    let whereCondition = {};

    if (userId === 1) {
        whereCondition = { userId: { [Op.not]: 1 }, statusId };
    } else {
        whereCondition = { userId, statusId };
    }

    const transaction = await Transaction_List?.findAll({
        include : 
        [
            {
                model : Transaction_Status,
                as : "transactionStatus"
            },
            {
                model : Transaction_Detail,
                as : "transactionDetail",
            } 
        ],
        where : whereCondition
    })
    res.status(200).json({
        type : "success",
        message : "Here are your order lists",
        userId,
        data : transaction
    })
    }catch(error){
        next(error)
    }
}

const createTransactions = async (req, res, next) => {
    try{
        const { userId } = req.user;
        const { transport, totalPrice } = req.body;

        const startTransaction = await Cart?.findAll({
            include : [
                {
                    model : Product_Detail,
                    as : "product_detail"
                },
                {
                    model : Product_List,
                    as : "cartList"
                }
            ],
            where : {[Op.and] : [{ userId },{inCheckOut : 1}]}
        })

        const newTransactionList = {
            userId : userId,
            total : totalPrice + transport,
            transport : transport,
            subtotal : totalPrice,
            statusId : 1
        }
        console.log(newTransactionList)

        const newTransaction = await Transaction_List?.create(newTransactionList);

        for(let i=0 ; i<startTransaction.length; i++){
            const newTransactionDetail = {
                transactionId : newTransaction.transactionId,
                price : startTransaction[i].cartList.productPrice,
                quantity : startTransaction[i].quantity,
                totalPrice : startTransaction[i].cartList.productPrice*startTransaction[i].quantity,
                productId : startTransaction[i].productId
            }
            await Transaction_Detail?.create(newTransactionDetail)
        }

        const finishTransaction = await Cart?.destroy({where : {[Op.and] : [{userId : userId},{inCheckOut : 1}]}})

        res.status(200).json({
            type : "success",
            message : "Transaction created!",
            data : finishTransaction
        })
    }catch(error){
        next(error)
    }
}

module.exports = {
    getTransactions,
    createTransactions
}