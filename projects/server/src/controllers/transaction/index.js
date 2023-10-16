const { Op, Transaction, EagerLoadingError } = require("sequelize");
const moment = require("moment")
const { middlewareErrorHandling } = require("../../middleware");
const cloudinary = require("cloudinary");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");
const { helperTransporter } = require("../../helper/index.js");
const {
  Transaction_List,
  Transaction_Detail,
  Transaction_Status,
  Discount_Transaction,
  Discount,
  Discount_Product,
} = require("../../model/relation.js");
const { Cart } = require("../../model/cart.js");
const { Product_Detail, Product_List, Product_History, Product_Unit, Product_Recipe } = require("../../model/product");
const { User_Address, User_Account, User_Profile } = require("../../model/user");
const { REDIRECT_URL, GMAIL } = require("../../config/index.js");
const { addAbortListener } = require("events");
const db = require("../../model/index.js")

async function cancelExpiredTransactions() {
  try {
    // const currentTime = moment().add(1, "minutes").format("YYYY-MM-DD HH:mm:ss");
    const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

    const discountExpiredList = await Discount.findAll({where : {discountExpired : {[Op.lte]:currentTime}}})
    
    const expiredDiscountId = discountExpiredList.map((list)=>{return list.discountId})
    
    await Discount.update({isDeleted : 1}, { where : { discountId : {[Op.in] :expiredDiscountId } } })
    
    await Discount_Product.update({isDeleted : 1}, { where : { discountId : {[Op.in] :expiredDiscountId } } })

    const transactionsToCancel = await Transaction_List.findAll({
      include:[
        {
          model: User_Account,
          attributes : ["email"],
          include: {
            model: User_Profile,
            as: "userProfile"
          }
        },
      ],
      where: {
        statusId: 1,
        expired: {
          [Op.lte]: currentTime,
        },
      },
    });

    for (const transaction of transactionsToCancel) {
      await transaction.update({ 
        statusId: 7,
        canceledBy : "Sistem",
        message : "Melewati batas waktu pembayaran"
      })

      const name = transaction.dataValues?.user_account.userProfile.name;
      const email = transaction.dataValues?.user_account.email;

      const template = fs.readFileSync(path.join(process.cwd(), "templates", "cancel-transaction.html"), "utf8");
      const html = handlebars.compile(template)({ 
        name : (name),
        information : "Mohon maaf, transaksi kamu tidak dapat dilanjutkan oleh Team Apotech karena telah melewati batas waktu pembayaran",
        link : (REDIRECT_URL + `/products`) 
      })

      const mailOptions = {
          from: `Apotech Team Support <${GMAIL}>`,
          to: email,
          subject: `Pesanan Dibatalkan ${transaction.dataValues?.createdAt}`,
          html: html
        }

      helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        console.log("Email sent: " + info.response);
      })
    }
    
  } catch (error) {
    console.error("Error while canceling expired transactions:", error);
  }
}

const getTransactions = async (req, res, next) => {

  try {
    const { userId, roleId } = req.user;
    const { statusId } = req.params;
    const { page, sortDate, startFrom, endFrom, sortTotal, filterName, invoice } = req.query;

    const limit = 5;
        
    const options = {
      offset: page > 1 ? (page - 1) * limit : 0,
      limit,
    }

    let whereCondition = {};
    const sort = []
    const filtering = {}

    if (roleId === 1) {
      whereCondition = { statusId };
    } else {
      whereCondition = { userId, statusId };
    }

    if(startFrom) {
      if (roleId === 1) {
        whereCondition.updatedAt = {
          [Op.gte]: moment(startFrom).subtract(12, "hours").format("YYYY-MM-DD HH:mm:ss"),
          [Op.lte]: moment(endFrom).add(24, "hours").format("YYYY-MM-DD HH:mm:ss"),
          // [Op.gte]: moment(startFrom).add(1,"d").subtract(4,"h").format("YYYY-MM-DD hh:mm:ss"),
          // [Op.lte]: moment(endFrom).add(2,"d").subtract(5,"h").format("YYYY-MM-DD hh:mm:ss"),
        }
      }

      if (roleId === 2) {
        whereCondition.createdAt = {
          [Op.gte]: moment(startFrom).subtract(12, "hours").format("YYYY-MM-DD HH:mm:ss"),
          [Op.lte]: moment(endFrom).add(24, "hours").format("YYYY-MM-DD HH:mm:ss"),
        }
        console.log("Start", moment(startFrom).subtract(12, "hours").format("YYYY-MM-DD HH:mm:ss"));
        console.log("End", moment(endFrom).add(24 , "hours").format("YYYY-MM-DD HH:mm:ss"));
      }
    }

    if(filterName) filtering.name = {"name" : {[Op.like]: `%${filterName}%`}}
    
    if(sortDate) {
      roleId === 1 ? sort.push(['updatedAt',sortDate ? sortDate : "DESC"]) : sort.push(['createdAt',sortDate ? sortDate : "DESC"])
    }
    if(sortTotal) sort.push(['total',sortTotal])
    if(invoice) whereCondition.invoice = {[Op.like]: `%${invoice}%`}

    const transaction = await Transaction_List?.findAll({
      include: [
        {
          model: Transaction_Status,
          as: "transactionStatus",
        },
        {
          model: Transaction_Detail,
          as: "transactionDetail",
          include: {
            model: Product_List,
            as: "listedTransaction",
          },
        },
        {
          model: User_Address,
        },
        {
          model: User_Account,
          attributes : ["email"]
        },
        {
          model: User_Profile,
          as: "userProfile",
          where:filtering.name,
        },
        {
          model: Discount_Transaction,
          attributes : {exclude :['productListId']},
          include:{
            model:Discount
          }
        }
      ],
      where: whereCondition,
      order : sort,
      ...options
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    if (statusId !== 7) {
      delete transaction?.dataValues?.canceledBy;
      delete transaction?.dataValues?.message;
    }

    const totalTransactions = await Transaction_List.count({where: whereCondition})
    const totalPage = Math.ceil(totalTransactions / limit)

    res.status(200).json({
      type: "success",
      message: "Here are your order lists",
      totalPage,
      currentPage: +page,
      nextPage: +page === totalPage ? null : +page + 1,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }

};

const getOngoingTransactions = async (req, res, next) =>{
  try {
    const { userId } = req.user;

    let whereCondition = {};

    if (userId === 1) {
      whereCondition = { statusId : { [Op.not]: [6, 7] } };
    } else {
      whereCondition = { userId, statusId : { [Op.not]: [6, 7] } };
    }

    const transactions = await Transaction_List?.findAll({
      where: whereCondition,
    });

    const statuses = await Transaction_Status?.findAll()

    const data = {
      totalTransactions: transactions.length,
      transactions : []
    }
    
    statuses.forEach(status => {
      const statusId = status.statusId;
      const statusDesc = status.statusDesc

      if (statusId !== 7 && statusId !== 6) {
        const total = transactions.filter(
          (transaction) => transaction.statusId === statusId
        ).length;
        
        data.transactions.push({statusId, statusDesc, total});
      }
    })
    
    res.status(200).json({
      type: "success",
      message: "Here are your ongoing transactions",
      data
    });
  } catch (error) {
    next(error)
  }
}

const createTransactions = async (req, res, next) => {
  try {
    //const transaction = await db.sequelize.transaction(async()=>{
    const { userId } = req.user;
    const { transport, totalPrice, addressId,discountId, discount } = req.body;

    const startTransaction = await Cart?.findAll({
      include: [
        {
          model: Product_Detail,
          as: "product_detail",
          include : {
            model: Discount_Product,
            as: "productDiscount"
          },
        },
        {
          model: Product_List,
          as: "cartList",
          include:
          {
            model: Discount_Product,
            attributes: { exclude: ["discountProductId"] },
            as: "discountProducts",
            where:{isDeleted:0},
            include: {
              model: Discount,
              where: { isDeleted: 0, 
                [Op.or] :[
                  {discountExpired :{[Op.gte] : moment()}},
                  {discountExpired :{[Op.is] : null}}
                ]
              },
              required: false,
            },
            required: false,
          },
        },
      ],
      where: { [Op.and]: [{ userId }, { inCheckOut: 1 }] },
    });

    const expiredTime = moment().add(24, 'hours').format("YYYY-MM-DD HH:mm:ss");
    let date = new Date().getTime()

    const newTransactionList = {
      userId: userId,
      total: +totalPrice + +transport + -discount,
      transport: transport,
      subtotal: totalPrice,
      discount: discount,
      statusId: 1,
      addressId : addressId,
      expired : expiredTime,
      invoice : `${userId + new Date().getTime()}`
    };

    const newTransaction = await Transaction_List?.create(newTransactionList);
    if(discountId.length>0) { 
      const discountIdList =[]
      for(let i = 0; i < discountId.length; i++){
        discountIdList.push({ 
          transactionId : newTransaction.transactionId,
          discountId : discountId[i]
        })
      }
      await Discount_Transaction.bulkCreate(discountIdList)
    }
    
    for (let i = 0; i < startTransaction.length; i++) {
      let price = 0;
      let totalPrice = 0;
      if(startTransaction[i].product_detail.productDiscount[0]?.endingPrice){
        price = startTransaction[i].product_detail.productDiscount[0].endingPrice;
        totalPrice = startTransaction[i].product_detail.productDiscount[0].endingPrice * startTransaction[i].quantity;
      }
      else{
        price = startTransaction[i].cartList.productPrice
        totalPrice = startTransaction[i].cartList.productPrice * startTransaction[i].quantity
      }
      const newTransactionDetail = {
        transactionId: newTransaction.transactionId,
        price: price,
        quantity: startTransaction[i].quantity,
        totalPrice: totalPrice,
        productId: startTransaction[i].productId,
      };
      await Transaction_Detail?.create(newTransactionDetail);

      const UpdateStock = await Product_Detail?.findOne(
        { include : {model : Product_Unit, as : "product_unit"},
          where : {[Op.and]: [{productId : startTransaction[i].productId},{isDefault : 1}]}});
      let newQuantity = startTransaction[i].cartList?.discountProducts?.length > 0 && startTransaction[i]?.cartList?.discountProducts[0]?.discount?.oneGetOne ? UpdateStock.quantity - (startTransaction[i].quantity*2) : UpdateStock.quantity - startTransaction[i].quantity;
      if(newQuantity < 0) throw ({status : middlewareErrorHandling.BAD_REQUEST_STATUS, message : middlewareErrorHandling.ITEM_NOT_ENOUGH});
      await Product_Detail?.update({quantity : newQuantity},{where : {[Op.and]: [{productId : startTransaction[i].productId},{isDefault : 1}]}});

      const ProductHistory = {
        productId : startTransaction[i].productId,
        unit : UpdateStock.product_unit.name,
        initialStock : UpdateStock.quantity,
        type : "Pengurangan",
        status : startTransaction[i].cartList?.discountProducts[0]?.discount?.oneGetOne ? "Penjualan Buy One Get One" : "Penjualan",
        quantity : startTransaction[i].cartList?.discountProducts[0]?.discount?.oneGetOne ? startTransaction[i].quantity*2 : startTransaction[i].quantity,
        results : newQuantity
      }
      await Product_History?.create(ProductHistory);
    }    

    const finishTransaction = await Cart?.destroy({
      where: { [Op.and]: [{ userId: userId }, { inCheckOut: 1 }] },
    });

    const customer = await User_Account?.findOne({
      where : { userId : userId }
    })

    const template = fs.readFileSync(path.join(process.cwd(), "templates", "transactionSuccessful.html"), "utf8");
    const html = handlebars.compile(template)({ 
      order: (newTransaction.transactionId),
      invoice : (newTransactionList.invoice)
    })

    const mailOptions = {
        from: `Apotech Team Support <${GMAIL}>`,
        to: customer?.dataValues?.email,
        subject: `Transaksi Berhasil untuk Invoice No. ${newTransactionList.invoice}`,
        html: html
      }

      helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
      })
    //});

    //await transaction.commit();

    res.status(200).json({
      type: "success",
      message: "Transaction created!",
      data: finishTransaction,
    });
  } catch (error) {
    //await transaction.rollback();
    next(error);
  }
};

const getCheckoutProducts = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const startTransaction = await Cart?.findAll({
      include: [
        {
          model: Product_Detail,
          as: "product_detail",
          include : {
            model: Discount_Product,
            as: "productDiscount",
            where : {isDeleted : 0}
          },
        },
        {
          model: Product_List,
          as: "cartList",
        },
      ],
      where: { [Op.and]: [{ userId: userId }, { inCheckOut: 1 }] },
    });
    res.status(200).json({
      type: "success",
      message: "Done!",
      data: startTransaction,
    });
  } catch (error) {
    next(error);
  }
};

// update ongoing status 1 to 2
const uploadPaymentProof = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { transactionId } = req.params;

    const transaction = await Transaction_List?.findOne({
      include:[
        {
          model: User_Account,
          attributes : ["email"],
          include: {
            model: User_Profile,
            as: "userProfile"
          }
        },
      ],
      where: { [Op.and]: [{ userId }, { statusId : 1 }, { transactionId }] },
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    if (!req.file) {
      return next({
        type: "error",
        status: middlewareErrorHandling.BAD_REQUEST_STATUS,
        message: middlewareErrorHandling.IMAGE_NOT_FOUND,
      });
    }
    
    await transaction.update({ paymentProof: req?.file?.filename, statusId : 2 });
    await transaction.update({ statusId : 2 });
    
    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    const name = transaction.dataValues?.user_account.userProfile.name;
    const email = transaction.dataValues?.user_account.email;

    const template = fs.readFileSync(path.join(process.cwd(), "templates", "upload-payment-proof.html"), "utf8");
    const html = handlebars.compile(template)({ 
      name: (name), 
      link :(REDIRECT_URL + `/products`) 
    })

    const mailOptions = {
        from: `Apotech Team Support <${GMAIL}>`,
        to: email,
        subject: `Menunggu Konfirmasi ${transaction.dataValues?.createdAt}`,
        html: html
      }

      helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        console.log("Email sent: " + info.response);
      })

    res
      .status(200)
      .json({
        type: "success",
        message: "Payment proof uploaded!",
        imageURL: req?.file?.filename,
      });
  } catch (error) {
    cloudinary.v2.api.delete_resources([`${req?.file?.filename}`], {
      type: `upload`,
      resource_type: "image",
    });
    next(error);
  }
};

// update ongoing status 2 to 3
const confirmPayment = async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction_List?.findOne({
      include:[
        {
          model: User_Account,
          attributes : ["email"],
          include: {
            model: User_Profile,
            as: "userProfile"
          }
        },
      ],
      where: { [Op.and]: [ { statusId : 2 }, { transactionId }] },
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    await transaction.update({ statusId : 3 })

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    const name = transaction.dataValues?.user_account.userProfile.name;
    const email = transaction.dataValues?.user_account.email;

    const template = fs.readFileSync(path.join(process.cwd(), "templates", "ongoing-2-5.html"), "utf8");
    const html = handlebars.compile(template)({
      name: (name), 
      title: ("Pembayaran Diterima"),
      ongoingStatus:("pembayaran kamu sudah diterima dan akan segera diproses"), 
      link :(REDIRECT_URL + `/products`) })

    const mailOptions = {
        from: `Apotech Team Support <${GMAIL}>`,
        to: email,
        subject: `Pembayaran Diterima ${transaction.dataValues?.createdAt}`,
        html: html
      }

      helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        console.log("Email sent: " + info.response);
      })

    res
      .status(200)
      .json({
        type: "success",
        message: "Payment accepted!",
        data: transaction
      });
  } catch (error) {

    next(error);
  }
};

// update ongoing status 3 to 4
const processOrder = async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction_List?.findOne({
      include:[
        {
          model: User_Account,
          attributes : ["email"],
          include: {
            model: User_Profile,
            as: "userProfile"
          }
        },
      ],
      where: { [Op.and]: [{ statusId : 3 }, { transactionId }] },
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    await transaction.update({ statusId : 4 })

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    const name = transaction.dataValues?.user_account.userProfile.name;
    const email = transaction.dataValues?.user_account.email;

    const template = fs.readFileSync(path.join(process.cwd(), "templates", "ongoing-2-5.html"), "utf8");
    const html = handlebars.compile(template)({
      name: (name), 
      title: ("Pesanan Diproses"),
      ongoingStatus:("pesanan kamu sedang diproses dan akan segera dikirimkan"), 
      link :(REDIRECT_URL + `/products`) })

    const mailOptions = {
        from: `Apotech Team Support <${GMAIL}>`,
        to: email,
        subject: `Pesanan Diproses ${transaction.dataValues?.createdAt}`,
        html: html
      }

      helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        console.log("Email sent: " + info.response);
      })

    res
      .status(200)
      .json({
        type: "success",
        message: "Order processed!",
        data: transaction
      });
  } catch (error) {

    next(error);
  }
};

// update ongoing status 4 to 5
const sendOrder = async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction_List?.findOne({
      include:[
        {
          model: User_Account,
          attributes : ["email"],
          include: {
            model: User_Profile,
            as: "userProfile"
          }
        },
      ],
      where: { [Op.and]: [{ statusId : 4 }, { transactionId }] },
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    await transaction.update({ statusId : 5 })

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    const name = transaction.dataValues?.user_account.userProfile.name;
    const email = transaction.dataValues?.user_account.email;

    const template = fs.readFileSync(path.join(process.cwd(), "templates", "ongoing-2-5.html"), "utf8");
    const html = handlebars.compile(template)({
      name: (name), 
      title: ("Pesanan Dikirim"),
      ongoingStatus:("pesanan kamu sedang dikirim"), 
      link :(REDIRECT_URL + `/products`) })

    const mailOptions = {
        from: `Apotech Team Support <${GMAIL}>`,
        to: email,
        subject: `Pesanan Dikirim ${transaction.dataValues?.createdAt}`,
        html: html
      }

      helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        console.log("Email sent: " + info.response);
      })

    res
      .status(200)
      .json({
        type: "success",
        message: "Order sent!",
        data: transaction
      });
  } catch (error) {

    next(error);
  }
};

// update ongoing status 5 to 6
const receiveOrder = async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction_List?.findOne({
      include:[
        {
          model: User_Account,
          attributes : ["email"],
          include: {
            model: User_Profile,
            as: "userProfile"
          }
        },
      ],
      where: { [Op.and]: [{ statusId : 5 }, { transactionId }] },
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    await transaction.update({ statusId : 6 })

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    const name = transaction.dataValues?.user_account.userProfile.name;
    const email = transaction.dataValues?.user_account.email;

    const template = fs.readFileSync(path.join(process.cwd(), "templates", "receive-order.html"), "utf8");
    const html = handlebars.compile(template)({ 
      name : (name), 
      link : (REDIRECT_URL + `/products`) 
    })

    const mailOptions = {
        from: `Apotech Team Support <${GMAIL}>`,
        to: email,
        subject: `Pesanan Diterima ${transaction.dataValues?.createdAt}`,
        html: html
      }

      helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        console.log("Email sent: " + info.response);
      })

    res
      .status(200)
      .json({
        type: "success",
        message: "Order received!",
        data: transaction
      });
  } catch (error) {

    next(error);
  }
};

// update ongoing status to 7
const cancelTransaction = async (req, res, next) => {
  try {

    const { transactionId } = req.params;
    const { roleId, userId } = req.user;
    const { message } = req.body;

    let whereCondition = {}

    if (roleId === 1) {
      whereCondition = { transactionId };
    } else {
      whereCondition = { userId, transactionId };
    }

    const transaction = await Transaction_List?.findOne({
      include:[
        {
          model: User_Account,
          attributes : ["email"],
          include: {
            model: User_Profile,
            as: "userProfile"
          }
        },
        {
          model: Transaction_Detail,
          as: "transactionDetail",
          // include: {
          //   model: Product_List,
          //   as: "listedTransaction",
          // },
        },
      ],
      where: whereCondition,
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    if (roleId === 2 && transaction.dataValues.statusId !== 1) {
      throw ({
        status: middlewareErrorHandling.BAD_REQUEST_STATUS,
        message: "Transaction cannot be canceled."
      })
    }

    if ([1, 2, 3].includes(transaction.dataValues.statusId)) {
      await transaction.update({
        statusId: 7,
        message,
        canceledBy: roleId === 1 ? "Admin" : "User",
      });
    
      let reason = "";
      let information = "";
      // email jika dibatalkan oleh user
      if (roleId === 2) {
        information = "Pesananmu berhasil dibatalkan!"
      }
      // email jika dibatalkan oleh admin
      if (roleId === 1) {
        reason = transaction.dataValues?.message;
        information = `Mohon maaf, transaksi kamu tidak dapat dilanjutkan oleh Team Apotech karena ${reason}`;
      }

      //TODO : use these logic to proceed reverse stock
      //get transaction list
      const reverseList = await Transaction_Detail.findAll({where : {
        transactionId : transactionId,
      }})

      // //product check
      for (const item of reverseList){
        // reverseList.map(async (item) =>{ 
          const {productId, quantity} = item
          //seandainya di product resep, ada barangnya
          const listRecipe = await Product_Recipe.findAll({where : 
          {
            productId : productId
          }})
          //produk satuan
          if(listRecipe.length === 0){
            await normalProductCancel(productId, quantity)
          }
        //stock yang berubah hanya komposisi. obat racik = kumpulan produk sec unit
          if(listRecipe.length !== 0){
          //  await Promise.all(
          //   listRecipe.map(async (itemRecipe) =>{
            await customProductCancel(listRecipe,quantity)
            // }))
          }
        }
      // })

      const name = transaction.dataValues?.user_account.userProfile.name;
      const email = transaction.dataValues?.user_account.email;

      const template = fs.readFileSync(path.join(process.cwd(), "templates", "cancel-transaction.html"), "utf8");
      const html = handlebars.compile(template)({ 
        name : (name),
        information : (information),
        link : (REDIRECT_URL + `/products`) 
      })

      const mailOptions = {
          from: `Apotech Team Support <${GMAIL}>`,
          to: email,
          subject: `Pesanan Dibatalkan ${transaction.dataValues?.createdAt}`,
          html: html 
        }

      helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        console.log("Email sent: " + info.response);
      })

      res.status(200).json({
        type: "success",
        message: "Transaction canceled!",
        data: transaction,
      });
      
    } else {
      throw new Error("Transaction cannot be canceled.");
    }
  
  } catch (error) {

    next(error);
  }
};

// update ongoing status 2 to 1
const rejectPayment = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const { message } = req.body;

    const transaction = await Transaction_List?.findOne({
      include:[
        {
          model: User_Account,
          attributes : ["email"],
          include: {
            model: User_Profile,
            as: "userProfile"
          }
        },
      ],
      where: { [Op.and]: [{ statusId : 2 }, { transactionId }] },
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

      await transaction.update({
        statusId: 1,
        message,
        canceledBy: "Admin"
      });

      const reason = transaction.dataValues?.message;
      const information = `Mohon maaf, pembayaran kamu ditolak oleh Team Apotech karena ${reason}`;

      const name = transaction.dataValues?.user_account.userProfile.name;
      const email = transaction.dataValues?.user_account.email;

      const template = fs.readFileSync(path.join(process.cwd(), "templates", "reject-payment.html"), "utf8");
      const html = handlebars.compile(template)({ 
        name : (name),
        // bankName : (bankName),
        // bankAccount : (bankAccount),
        // accountHolder : (accountHolder),
        information : (information),
        link : (REDIRECT_URL + `/user/transaction`) 
      })

      const mailOptions = {
          from: `Apotech Team Support <${GMAIL}>`,
          to: email,
          subject: `Pembayaran Ditolak ${transaction.dataValues?.createdAt}`,
          html: html
        }

      helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        console.log("Email sent: " + info.response);
      })

      res.status(200).json({
        type: "success",
        message: "Payment rejected!",
        data: transaction,
      });
  } catch (error) {

    next(error);
  }
};

const getTransactionStatus = async (req, res, next) => {
  try {
    const status = await Transaction_Status.findAll();
    res.status(200).json({
      type: "success",
      message: "Status fetched",
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

async function normalProductCancel(productId,quantity){
     
  const defaultUnit = await Product_Detail.findOne({
    where : {
      productId : productId,
      isDefault : true
    },
    include :[ 
      {
        model : Product_Unit,
      }
    ]
  })

  await Product_History.create({
    productId : productId,
    unit : defaultUnit.dataValues?.product_unit.name,
    initialStock : defaultUnit.dataValues?.quantity,
    status : "Pembatalan Transaksi",
    type : "Penambahan",
    quantity : quantity,
    results : +defaultUnit.dataValues?.quantity + quantity
  })
  //update qtynya

  await Product_Detail.update({
    quantity : +defaultUnit?.dataValues?.quantity + quantity
  },{
    where : {
      productId : productId,
      isDefault : true
    }
  })
  // return "1";
}

async function customProductCancel(listRecipe,quantity){

  for (const itemRecipe of listRecipe){
    await customIngredientCancel(itemRecipe,quantity)
  }
}

async function customIngredientCancel(itemRecipe, quantity) {

      const mainUnit = await Product_Detail.findOne({
        where : {
          productId : itemRecipe?.dataValues?.ingredientProductId,
          isDefault : true
        },
        include :[ 
          {
            model : Product_Unit,
          }
        ]
      })
      const secUnit = await Product_Detail.findOne({
        where : {
          productId : itemRecipe?.dataValues?.ingredientProductId,
          isDefault : false
        },
        include :[
        {
          model : Product_Unit,
        }]
      })
      //seandainya awalnya stock ada 12 sec, kepake cmn 4
      //quantity di transaksi x quantity di resep produknya =  total ingredients yang kepakai
      //cth : kejual 3 biji, 1 biji perlu 3 butir panadol
      //brrti kepake 9 butir
      //cth cmn perlu 8, brrti kepake 3 main, sisa 1
      const totalIngredientQuantity = quantity * itemRecipe?.dataValues?.quantity

      //stock obat racik : 1 quantity untuk obat raciknya
      //ingredient : 2 , convertion 2
      //sec ingredient > convertion
      console.log("nilainya ",totalIngredientQuantity)
      //seandainya totalIngredientQuantity < main unit convertion?


      if(totalIngredientQuantity < mainUnit?.dataValues?.convertion){
      //cek dlu apakah totalIngredientQuantity + secUnit.quantity >= convertion
      //kalau iya brrti terjadi konversi; cth : total 7, sec unit 1 conv 8, brrti awalnya ada 6

      if(totalIngredientQuantity + secUnit.dataValues?.quantity >= mainUnit?.dataValues?.convertion){
      //update both unit
      const currentSecUnitQuantity = totalIngredientQuantity + secUnit.dataValues?.quantity - mainUnit?.dataValues?.convertion
      console.log("initial stock di obat racik "+mainUnit.dataValues?.quantity)
      await Product_History.create({
        productId : itemRecipe?.dataValues?.ingredientProductId,
        unit : mainUnit.dataValues?.product_unit.name,
        initialStock : mainUnit.dataValues?.quantity,
        status : "Pembatalan Transaksi",
        type : "Penambahan",
        quantity : 1,
        results : +mainUnit.dataValues?.quantity + 1
      })
      await Product_History.create({
        productId : itemRecipe?.dataValues?.ingredientProductId,
        unit : secUnit.dataValues?.product_unit.name,
        initialStock : secUnit.dataValues?.quantity,
        status : "Pembatalan Transaksi",
        type : "Pengurangan",
        quantity : Math.abs(totalIngredientQuantity - mainUnit?.dataValues?.convertion),
        results : +currentSecUnitQuantity
      })
      //update qtynya
      await Product_Detail.update({
        quantity : +mainUnit.dataValues?.quantity + 1
      },{
        where : {
          productId : itemRecipe?.dataValues?.ingredientProductId,
          isDefault : true
        }
      })
      await Product_Detail.update({
        quantity : +currentSecUnitQuantity
      },{
        where : {
          productId : itemRecipe?.dataValues?.ingredientProductId,
          isDefault : false
        }
      })

      }
      //kalau kurang brrti gaterjadi konversi
      if(totalIngredientQuantity + secUnit.dataValues?.quantity < mainUnit?.dataValues?.convertion){
      //update only sec unit
      console.log("konversinya "+mainUnit?.dataValues?.convertion)
      await Product_History.create({
        productId : itemRecipe?.dataValues?.ingredientProductId,
        unit : secUnit.dataValues?.product_unit.name,
        initialStock : secUnit.dataValues?.quantity,
        status : "Pembatalan Transaksi",
        type : "Pengurangan",
        quantity : +totalIngredientQuantity,
        results :  +totalIngredientQuantity + secUnit?.dataValues?.quantity
      })

      await Product_Detail.update({
        quantity :  +totalIngredientQuantity + +secUnit?.dataValues?.quantity
      },{
        where : {
          productId : itemRecipe?.dataValues?.ingredientProductId,
          isDefault : false
        }
      })

      }
      }
      //kalau totalIngredientQuantity >= main unit convertion
      //pasti terjadi konversi
      if(totalIngredientQuantity >= mainUnit?.dataValues?.convertion){
        // sisa skrg 4, konversi 8, perlu 20, dulu sisa brp ? 0
        // sisa skrg 5, konversi 20, perlu 210 dulu sisa? 15
        const currentMainUnitQuantity = Math.floor((totalIngredientQuantity + secUnit?.dataValues?.quantity) / mainUnit?.dataValues?.convertion)
        const currentSecUnitQuantity = (totalIngredientQuantity + secUnit?.dataValues?.quantity) % mainUnit?.dataValues?.convertion
        console.log("main unit qty : ",mainUnit.dataValues?.quantity)
        console.log("sec unit qty",secUnit.dataValues?.quantity)
        await Product_History.create({
          productId : itemRecipe?.dataValues?.ingredientProductId,
          unit : mainUnit.dataValues?.product_unit.name,
          initialStock : mainUnit.dataValues?.quantity,
          status : "Pembatalan Transaksi",
          type : "Penambahan",
          quantity : currentMainUnitQuantity,
          results : +mainUnit.dataValues?.quantity + currentMainUnitQuantity
        })
        await Product_History.create({
          productId : itemRecipe?.dataValues?.ingredientProductId,
          unit : secUnit.dataValues?.product_unit.name,
          initialStock : secUnit.dataValues?.quantity,
          status : "Pembatalan Transaksi",
          type : currentSecUnitQuantity > secUnit?.dataValues?.quantity ? "Penambahan" : "Pengurangan",
          quantity : Math.abs(currentSecUnitQuantity - secUnit?.dataValues?.quantity),
          results : currentSecUnitQuantity
        })
        //update qtynya
        await Product_Detail.update({
          quantity : +mainUnit.dataValues?.quantity + currentMainUnitQuantity
        },{
          where : {
            productId : itemRecipe?.dataValues?.ingredientProductId,
            isDefault : true
          }
        })
        await Product_Detail.update({
          quantity : +currentSecUnitQuantity
        },{
          where : {
            productId : itemRecipe?.dataValues?.ingredientProductId,
            isDefault : false
          }
        })
      } 

      console.log("role selesai")
}


module.exports = {
  getTransactions,
  getOngoingTransactions,
  createTransactions,
  getCheckoutProducts,
  uploadPaymentProof,
  confirmPayment,
  processOrder,
  sendOrder,
  receiveOrder,
  cancelTransaction,
  rejectPayment,
  cancelExpiredTransactions,
  getTransactionStatus,
}
