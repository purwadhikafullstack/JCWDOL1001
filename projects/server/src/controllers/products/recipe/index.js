const {middlewareErrorHandling} = require("../../../middleware/index.js");
const {Product_Recipe, Product_List, Product_Unit, Product_Detail, Product_History, Discount_Product,Discount,
  Transaction_List, Transaction_Detail} = require("../../../model/relation.js")
const moment = require("moment")
const {ingredientValidationSchema,
  customValidationSchema,
  normalValidationSchema} = require("./validation.js")
const {Op} = require("sequelize")
const path = require("path")
const fs = require("fs")
const handlebars = require("handlebars")
const{helperToken,helperTransporter} = require("../../../helper/index.js")
const {REDIRECT_BACKEND_URL,GMAIL, REDIRECT_URL} = require("../../../config/index.js")
const {} = require("./validation.js")
const {ValidationError} = require("yup");
const { User_Account, User_Address, User_Profile } = require("../../../model/user.js");
const Axios = require("axios");

const getUser = async( req, res, next ) => {
    try{
      const{page,search,sortDate} = req.query
    //   const userlist = await User_Account.findAll({where :{
    //     role : 2,
    //     status : 1,
    //    imgRecipe: {[Op.not] : null}
    //   },include : [{
    //     model : User_Profile,
    //     as : "userProfile"
    // }]})

    const currentPage = page ? parseInt(page) : 1;

    const options = {
        offset : currentPage > 1 ? parseInt(currentPage-1)*6 : 0,
        limit : 6,
    }

    const filter = {}
    const sort =  [[`createdRecipe`, sortDate ? sortDate : "DESC"]]

    // if(search) filter = {
    //   name :{[Op.like]: `%${search}%`} 
    // }
    // console.log(filter)
    const userlist = await User_Account.findAll({...options,
        where : {
            role : 2,
            status : 1,
           imgRecipe: {[Op.not] : null}
        },
        include : [{
          model : User_Profile,
          as : "userProfile",
          where : {
            name :{[Op.like]: `%${search}%`} 
          }
        }],
        order : sort
    })
    console.log(userlist)
    const total = await User_Account.count({where : {
      role : 2,
      status : 1,
     imgRecipe: {[Op.not] : null}
  },include : {
    model : User_Profile,
    as : "userProfile",
    where : {
      name :{[Op.like]: `%${search}%`} 
    }
  },
    })

    const pages = Math.ceil(total/options.limit)


      res.status(200).json({
        type : "success",
        message : "Data berhasil dimuat",
        currentPage : +page ? +page : 1,
        totalPage : pages,
        data : userlist,
      });
  
    } catch (error){
      next(error)
    }
  }

  function checkUniqueProductNames(products) {
  const seenNames = new Set();
  for (const product of products) {
    if (seenNames.has(product?.productName)) {
      throw ({ status : 404, 
        message : middlewareErrorHandling.PRODUCT_ALREADY_EXISTS});
    }
    seenNames.add(product?.productName);
  }
  return true; // All names are unique
}

  const checkIngredientStock = async( req, res, next ) => {
    try{
        // AddCustomProduct
        const {data,email} = req.body
        checkUniqueProductNames(data)

        const result = 
        await Promise.all(
        data.map(async (item) =>{ 
        const {type} = item
        
        if(type){
        const {ingredients, productName,
        productPrice, productDosage, quantity} = item
          //validation for data
           await customValidationSchema.validate({
            productName: productName,
            productDosage : productPrice,
            productQuantity : quantity,
            productPrice : productPrice
           })
        
        const product = await Product_List.create({
          productName,
          isDeleted : 1,
          productPicture : "review",
          productPrice,
          productDosage,
          productDescription : String(quantity)
        }
        )

        let availability = false;
        for ( let i = 0; i < ingredients.length; i++){
          await ingredientValidationSchema.validate({
            ingredientId : ingredients[i]?.productId,
            ingredientQuantity : ingredients[i]?.quantity,
          })

          const recipe = await Product_Recipe.create({
            productId : product?.productId,
            quantity : ingredients[i]?.quantity,
            ingredientProductId : ingredients[i]?.productId
          })

          const mainUnit = await Product_Detail.findOne({
            where : {
              productId : recipe?.ingredientProductId,
              isDefault : true
            }
          })
          const secUnit = await Product_Detail.findOne({
            where : {
              productId : recipe?.ingredientProductId,
              isDefault : false
            }
          })

          if(secUnit?.quantity < (quantity * recipe?.quantity)){
            const remainStock = (quantity * recipe?.quantity)- secUnit?.quantity
            const checker = Math.ceil(remainStock / mainUnit?.convertion)

            if(mainUnit?.quantity >= checker){
              availability = true;            
            }
            else{
              availability = false;
              break
            };
            
          }
          // -if qty unit secondary <= qty
          if(secUnit?.quantity >= (quantity * recipe?.quantity)){
            availability = true;
          }
          
        }
        if(availability){
          return {name : productName, productId : product?.productId, quantity : quantity, type : 1}
        }
      }
      //buat product biasa
      if(type === 0){
        const {productId, quantity} = item
        await normalValidationSchema.validate({productId : productId, productQuantity : quantity})
        let availability = false
        const result = await Product_List.findOne({where:{
          productId : productId
        },include: [{
            model : Product_Detail,
            attributes : ["quantity"]
        },
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
          },
          required: false,
        },]})
        //check if product categorized as buy 1 get 1
        let newQuantity = 
        (result.discountProducts[0]?.discount?.oneGetOne === true ?
          (quantity * 2) : quantity
        )
        console.log(result)
        if(newQuantity <= result?.product_details[0]?.quantity){
          availability = true
        }
        if(availability){
          console.log("here")
          return {name : result.productName, productId : productId, quantity : quantity, type : 0}
        }
      }
      })
      )

      // -kirim email untuk respond user
      const filteredResult = result.filter(item => item)

      //================================EMAIL SECTION===================================
      let message = `
      Kami telah memeriksa stok obat berdasarkan resep dokter yang Anda unggah.
      `
      let pathURL = ""
      const accessToken = helperToken.createToken({ 
        email : email,
        data : filteredResult
      });
      //kalau gak ready smua gmn
      if(filteredResult.length === 0){
        message += `Kabar buruknya adalah... kami tidak dapat memproses pesanan Anda karena stok produk tidak mencukupi.
        Tidak perlu khawatir! Anda masih bisa membeli produk lain yang Anda butuhkan di situs web kami.`
        pathURL = REDIRECT_URL
      }
      //kalau ready semua gimana
      else if(filteredResult.length === data.length){
        message += `Dan... Kabar Baik! Anda dapat melakukan checkout untuk item-item yang ada dalam daftar.
        Cukup klik tombol di bawah ini untuk mengonfirmasi bahwa Anda ingin melanjutkan pembelian Anda.`
        pathURL =  REDIRECT_URL + `/confirm/order-${accessToken}`
      }
      //kalau ready sebagian
      else{
        let itemList = ""
        console.log(itemList)
        for(let i = 0; i < filteredResult.length; i++){
          if(filteredResult.length === 1){
            itemList += filteredResult[i].name
          }else{
            if(i === filteredResult.length - 1){
              itemList +=  `dan ${filteredResult[i].name}`
            }
            else{
              itemList +=  `${filteredResult[i].name}, `
            }
          }
          }
        console.log(message)
        message += `Nah... Anda hanya dapat melakukan checkout untuk item-item yang terdapat dalam daftar berikut.
        Daftar Barang : ${itemList}.
        Pilihannya ada di tangan Anda. Tetapi jika Anda telah memutuskan untuk melanjutkan,
        Cukup klik tombol di bawah ini untuk mengonfirmasi bahwa Anda ingin melanjutkan pembelian Anda.`
        console.log(pathURL)
        pathURL =  REDIRECT_URL + `/confirm/order-${accessToken}`
      }

      const template = fs.readFileSync(path.join(process.cwd(), "projects/server/templates", "customProductConfirmation.html"), "utf8");
      const html = handlebars.compile(template)({ message: (message), link :(pathURL) })
      const mailOptions = {
          from: `Apotech Team Support <${GMAIL}>`,
          to: email,
          subject: "Resep dokter kamu sudah diulas",
          html: html}

          helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
              // if (error) throw error;
              console.log("Email sent: " + info.response);
          })
          
      await User_Account.update({
        imgRecipe : null
      },{where : {email}})

      res.status(200).json({ 
        type : "success",
        message : "Permintaan konfirmasi telah diberikan ke user terkait",
        data : filteredResult
      })
      
    } catch (error){
      next(error)
    }
  }

  const createCustomProductOrder = async( req, res, next ) => {
    try{
      const { token } = req.params;
      const decoded = helperToken.verifyToken(token);

     const {email,data}= decoded
     //get data user from email
     const user = await User_Account?.findOne({
        where :{
          email : email
        }
     })

     const address = await User_Address?.findOne({
      where : {
        addressId : user?.addressIdRecipe
      }
     })
     let subtotal = 0;
     if(!address) throw ({ status : 404, message : middlewareErrorHandling.ADDRESS_NOT_FOUND});
     //looping data per product
     let productResult = []

      for(const item of data){
        const {productId, name,type} = item

      if(type === 1){
      const result = await typeOneProduct(name,productId)
      subtotal += result.subtotal
      productResult.push({
        name : name, 
        productId : productId, 
        quantity : result.quantity,
        price : result.price,
      buyOneGetOne : result.buyOneGetOne })
    }
    
    if(type === 0){
      const {quantity} = item
      const result = await typeZeroProduct(name,productId,quantity)
      subtotal += result.subtotal
      productResult.push({
        name : result.name,
        productId : result.productId,
        quantity : result.quantity,
        price : result.price,
        buyOneGetOne : result.buyOneGetOne
      })
    }
  }

  const transportCost = +user?.shippingRecipe?.split(",")[2]
  const expiredTime = moment().add(24, 'hours').format("YYYY-MM-DD HH:mm:ss");
  let date = new Date().getTime()

  console.log(transportCost, " ", subtotal)
      //buat transaction list
      const translist = {
        userId : user?.userId,
        subtotal,
        transport : transportCost,
        total : subtotal + transportCost,
        invoice : `${user?.userId + new Date().getTime()}`,
        statusId : 1,
        addressId : address?.addressId,
        expired : expiredTime,
      }
      const listResult = await Transaction_List.create(translist)

    for(let i=0 ; i< productResult.length; i++){
        console.log(productResult[i])
        await Transaction_Detail?.create({
          transactionId : listResult?.transactionId,
          price : productResult[i].price,
          quantity : productResult[i].quantity,
          totalPrice : productResult[i].price * productResult[i].quantity,
          productId : productResult[i].productId,
          buyOneGetOne : productResult[i].buyOneGetOne
      })
    }

    await User_Account.update({
      addressIdRecipe : null,
      createdRecipe : null,
      shippingRecipe : null,
    },{where :  {userId : user?.userId}})

      res.status(200).json({ 
        type : "success", 
        // message : `Order #${listResult?.transactionId} berhasil dibuat!`,
        message : `Orderan kamu berhasil dibuat!`,
        data : listResult
      })
  
    } catch (error){
      next(error)
    }
  }

  const reverseStock = async( req, res, next ) => {
    try{
      //perlu array ingredient(productId, stockdulu, idDefault) 
      const unitProduct = await Product_Unit.findAll()
  
      res.status(200).json({ 
        type : "success",
        message : "Data berhasil dimuat",
        unit : unitProduct
      })
  
    } catch (error){
      next(error)
    }
  }

 async function typeOneProduct (name,productId){
  const arrayOne = []
        
  const product = await Product_List.findOne({
    where :{
      productId : productId,
      productPicture : "review"
    }
  })
  if(!product) throw ({ status : 404, 
    message : middlewareErrorHandling.PRODUCT_ALREADY_CHECKEDOUT});

  const newSubtotal = (product.productPrice * +product.productDescription)
  console.log("subtotal dari custom " ,newSubtotal)
  await Product_List.update({ productPicture : "Public/Products/OBATRACIK"},{
    where : {
      productId : productId,
    }
  })

  const ingredients = await Product_Recipe.findAll({
    where : {
      productId : productId
    }
  })
for ( let i = 0; i < ingredients.length; i++){
const recipeQty = ingredients[i]?.quantity
const ingredientProductId = ingredients[i]?.ingredientProductId
const mainUnit = await Product_Detail.findOne({
  where : {
    productId : ingredients[i]?.ingredientProductId,
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
    productId : ingredients[i]?.ingredientProductId,
    isDefault : false
  },
  include :[
  {
    model : Product_Unit,
  }]
})

// -if qty unit secondary < qty

if(secUnit?.quantity < (+product?.productDescription * recipeQty)){

// const
const remainStock = (+product?.productDescription * recipeQty) - secUnit?.quantity
// 2 x 3 - 5 = 1
//case 2 : 5 x 5 - 5 = 20 

const checker = Math.ceil(remainStock / mainUnit?.convertion)
// 1/10.ceil = 1
  // 20/10.ceil = 2
const remainSecStock = (mainUnit?.convertion * checker) - remainStock
// 1%10 = 1 => 10 * 1 - 1 = 9
  //case 2 : 10 * 2 - 20 = 0

  if(mainUnit?.quantity >= checker){

    //masukin product History
     await Product_History.create({
      productId : ingredientProductId,
      unit : mainUnit.product_unit.name,
      initialStock : mainUnit?.quantity,
      status : "Unit Conversion",
      type : "Pengurangan",
      quantity : checker,
      results : mainUnit?.quantity - checker
    })
    await Product_History.create({
      productId : ingredientProductId,
      unit : secUnit.product_unit.name,
      initialStock : secUnit?.quantity,
      status : "Unit Conversion",
      type : "Penambahan",
      quantity : +mainUnit?.convertion * checker,
      results : secUnit?.quantity + (+mainUnit?.convertion * checker)
    })
    await Product_History.create({
      productId : ingredientProductId,
      unit : secUnit.product_unit.name,
      initialStock : secUnit?.quantity + (+mainUnit?.convertion * checker),
      status : "Penjualan Obat Racik",
      type : "Pengurangan",
      quantity : +product?.productDescription * recipeQty,
      results : remainSecStock
    })
    //update qtynya
    await Product_Detail.update({
      quantity : mainUnit?.quantity - checker
    },{
      where : {
        productId : ingredientProductId,
        isDefault : true
      }
    })
    //(updateproductdetail secondsaryunit, qtybaru=  sisaqtysecondaryunit  save qty skrgnya!
    await Product_Detail.update({
      quantity : remainSecStock
    },{
      where : {
        productId : ingredientProductId,
        isDefault : false
      }
    })
  }

}
// -if qty unit secondary <= qty
if(secUnit?.quantity >= (+product?.productDescription * recipeQty)){
  // (updateproductdetail seoncadryunit, qtybaru = qtyskrg - qty save qty skrgnya! qtyskrg primary ambil dari productDetailmainunit

  await Product_History.create({
    productId : ingredientProductId,
    unit : secUnit.product_unit.name,
    initialStock : secUnit?.quantity,
    status : "Penjualan Obat Racik",
    type : "Pengurangan",
    quantity : +product?.productDescription * recipeQty,
    results : secUnit?.quantity - (+product?.productDescription * recipeQty)
  })
  await Product_Detail.update({
    quantity : secUnit?.quantity - (+product?.productDescription * recipeQty)
  },{
    where : {
        productId : ingredientProductId,
        isDefault : false
    }
  })
}
}

return {
  name : name, 
  productId : productId, 
  quantity : +product?.productDescription,
  price : product?.productPrice,  
subtotal : newSubtotal,
buyOneGetOne : 0
}
    
  }

async function typeZeroProduct(name,productId,quantity){
  const product = await Product_List?.findOne({where : {
    productId : productId
  },
    include : 
    [
      {
        model : Product_Unit,
        as : "productUnits"
      },
      {
        model : Product_Detail,
        attributes : ["quantity"]
      },
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
        },
        required: false,
      },
    ]})
  //kurang quantity
    //handling harga diskon
    let price = 
    (product?.discountProducts?.length !== 0 && product.discountProducts[0]?.discount?.oneGetOne === false ?
          product?.discountProducts[0]?.endingPrice : product?.productPrice
        )
    let newQuantity = 
    (product.discountProducts[0]?.discount?.oneGetOne === true ?
      (quantity * 2) : quantity
    )
  await Product_History.create({
    productId : productId,
    unit : product.productUnits[0]?.name,
    initialStock : product?.product_details[0].quantity,
    status : "Penjualan",
    type : "Pengurangan",
    quantity : newQuantity,
    results : product?.product_details[0].quantity - newQuantity
  })

  await Product_Detail.update(
    {quantity : product?.product_details[0].quantity - newQuantity},{
    where : {
      productId : productId,
      isDefault: true
    }
  })

  const newSubtotal = (price * quantity)
  console.log("subtotal dari normal " ,newSubtotal)

  return{
    name : name,
    productId : productId,
    quantity : quantity,
    price : price,
    subtotal : newSubtotal,
    buyOneGetOne : (product.discountProducts[0]?.discount?.oneGetOne === true ?
      1 : 0)
  }
  }

  module.exports = {
    getUser,
    checkIngredientStock,
    reverseStock,
    createCustomProductOrder
}
