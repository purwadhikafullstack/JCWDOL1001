const {middlewareErrorHandling} = require("../../../middleware/index.js");
const {Product_Recipe, Product_List, Product_Unit, Product_Detail, Product_History, 
  Transaction_List, Transaction_Detail} = require("../../../model/relation.js")
const {Op} = require("sequelize")
const path = require("path")
const fs = require("fs")
const handlebars = require("handlebars")
const{helperToken,helperTransporter} = require("../../../helper/index.js")
const {REDIRECT_BACKEND_URL,GMAIL, REDIRECT_URL} = require("../../../config/index.js")
const {} = require("./validation.js")
const {ValidationError} = require("yup");
const { User_Account, User_Address } = require("../../../model/user.js");
const Axios = require("axios");

const getUser = async( req, res, next ) => {
    try{
      const userlist = await User_Account.findAll({where :{
        role : 2,
        status : 1
      }})
  
      res.status(200).json({ 
        type : "success",
        message : "Data berhasil dimuat",
        data : userlist
      })
  
    } catch (error){
      next(error)
    }
  }

  const checkIngredientStock = async( req, res, next ) => {
    try{
        // AddCustomProduct
        const {data,email} = req.body
        //validate email address
          //todo : validate
        //ingrdient isinya productId dan quantity
        const result = await Promise.all(
        data.map(async (item) =>{ 
        const {ingredients, productName,
        productPrice, productDosage, quantity} = item
        //validation for data
          // TODO: validate
        // -gua perlu create product list, as productList misal 
        const product = await Product_List.create({
          productName,
          isDeleted : 1,
          productPicture : "review",
          productPrice,
          productDosage,
          productDescription : String(quantity)
        }
        )
        await Product_Detail.create({
          productId: product?.productId,
          unitId : 5,
          quantity : quantity,
          convertion : 0,
          isDefault : 1,
          isDeleted : 1
        })

        // looping boleh [{productId,qty},...]
        let availability = false;
        for ( let i = 0; i < ingredients.length; i++){
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
            
          }
          // -if qty unit secondary <= qty
          if(secUnit?.quantity >= (quantity * recipe?.quantity)){
            availability = true;
          }
        }
        if(availability){
          return {name : productName, productId : product?.productId}
        }
      }))

      // -kirim email untuk respond user
      const filteredResult = result.filter(item => item)

      //================================EMAIL SECTION===================================
      let message = `
      We have checked on our stocks of the custom medicine's ingredients based on 
      your uploaded doctor prescription.
      `
      let pathURL = ""
      const accessToken = helperToken.createToken({ 
        email : email,
        data : filteredResult
      });
      //kalau gak ready smua gmn
      if(filteredResult.length === 0){
        message += `Bad news is... we couldn't proceed your order due to insufficient product stock.
        Fear not! You could still purchase another product you need at our website.`
        pathURL = REDIRECT_URL
      }
      //kalau ready semua gimana
      else if(filteredResult.length === data.length){
        message += `And... good news! You can checkout any items included in the list. 
        Just click the button below to confirm that you would like to proceed your purchase.`
        pathURL =  REDIRECT_BACKEND_URL + `/api/products/recipe/order/${accessToken}`
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
              itemList +=  `and ${filteredResult[i].name}`
            }
            else{
              itemList +=  `${filteredResult[i].name}, `
            }
          }
          }
        console.log(message)
        message += `Well... You could only checkout items that included in the following list.
        item(s) : ${itemList}.
        Choice is yours. But if you make up your mind to proceed,
        Just click the button below to confirm that you would like to proceed your purchase`
        console.log(pathURL)
        pathURL =  REDIRECT_BACKEND_URL + `/api/products/recipe/order/${accessToken}`
      }

      const template = fs.readFileSync(path.join(process.cwd(), "templates", "customProductConfirmation.html"), "utf8");
      const html = handlebars.compile(template)({ message: (message), link :(pathURL) })
      const mailOptions = {
          from: `Apotech Team Support <${GMAIL}>`,
          to: email,
          subject: "Your uploaded prescription has been reviewed.",
          html: html}

          helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
              if (error) throw error;
              console.log("Email sent: " + info.response);
          })
  
      res.status(200).json({ 
        type : "success",
        message : "We have send the desired user",
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
        isPrimary : 1,
        isDeleted : 0,
        userId : user?.userId
      }
     })
     let subtotal = 0;
     if(!address) throw ({ status : 404, message : middlewareErrorHandling.ADDRESS_NOT_FOUND});
     //looping data per product
     let productResult = await Promise.all(
      data.map(async (item) =>{ 
        const {productId, name} = item
        const product = await Product_List.findOne({
          where :{
            productId : productId,
            productPicture : "review"
          }
        })
        if(!product) throw ({ status : 404, 
          message : middlewareErrorHandling.PRODUCT_ALREADY_CHECKEDOUT});

        subtotal += (product.productPrice * +product.productDescription)
        await Product_List.update({ productPicture : "done"},{
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

      const remainStock = (+product?.productDescription * recipeQty) - secUnit?.quantity
      const checker = Math.ceil(remainStock / mainUnit?.convertion)
      const remainSecStock = remainStock % mainUnit?.convertion
      
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
            quantity : remainStock,
            results : secUnit?.quantity + remainStock
          })
          await Product_History.create({
            productId : ingredientProductId,
            unit : secUnit.product_unit.name,
            initialStock : secUnit?.quantity + remainStock,
            status : "Penjualan",
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
          status : "Penjualan",
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
        price : product?.productPrice  }
    }))
   
    //bagian ongkir-----------------------------------------------------------
    const {data:{rajaongkir:{results}}} = await Axios.post(process.env.REACT_APP_RAJAONGKIR_API_BASE_URL_COST,
      { 
          key : process.env.REACT_APP_RAJAONGKIR_API_KEY, 
          origin: 151, 
          destination: address?.postalCode, 
          weight: 1000, 
          courier: "pos"
      }
  )
  const transportCost = results[0]?.costs[0]?.cost[0]?.value 
      //buat transaction list
      const translist = {
        userId : user?.userId,
        subtotal,
        transport : transportCost,
        total : subtotal + transportCost,
        statusId : 1
      }
      const listResult = await Transaction_List.create(translist)

    for(let i=0 ; i< productResult.length; i++){
        console.log(productResult[i])
        await Transaction_Detail?.create({
          transactionId : listResult?.transactionId,
          price : productResult[i].price,
          quantity : productResult[i].quantity,
          totalPrice : productResult[i].price * productResult[i].quantity,
          productId : productResult[i].productId
      })
    }

      res.status(200).json({ 
        type : "success",
        message : `Order ${listResult?.transactionId} berhasil dibuat!`,
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

  module.exports = {
    getUser,
    checkIngredientStock,
    reverseStock,
    createCustomProductOrder
}
