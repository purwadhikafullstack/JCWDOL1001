const {middlewareErrorHandling} = require("../../../middleware/index.js");
const {Product_Recipe, Product_List, Product_Unit, Product_Detail, Product_History} = require("../../../model/relation.js")
const {Op} = require("sequelize")
const cloudinary = require("cloudinary");
const {inputProductValidationSchema, updateProductValidationSchema, updateMainStockValidationSchema } = require("./validation.js")
const {ValidationError} = require("yup");
const { User_Account } = require("../../../model/user.js");

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
        console.log(data.length)
        //validate email address
          //todo : validate
        //ingrdient isinya productId dan quantity
        const getResult = async() => {
        return await data.map(async (item) =>{ 
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

          if(secUnit?.quantity < quantity){
            const remainStock = quantity - secUnit?.quantity
            const checker = Math.ceil(remainStock / mainUnit?.convertion)

            if(mainUnit?.quantity >= checker){
              availability = true;            
            }
          }
          // -if qty unit secondary <= qty
          if(secUnit?.quantity < quantity){
            availability = true;
          }
        }
        if(availability){
          console.log(availability)
          console.log(productName, product?.productId)
          return [{name : productName, productId : product?.product}]
        }
      })}
      
      // -kirim email untuk respond user
      //kalau gak ready smua gmn

      //kalau ready sebagian

      //kalau ready semua gimana

        const result = getResult()
      res.status(200).json({ 
        type : "success",
        message : "Data berhasil dibuat",
        data : result
      })
  
    } catch (error){
      next(error)
    }
  }

  const createCustomProductOrder = async( req, res, next ) => {
    try{
     // AddCustomProduct
     
     const {ingredients}= req.body
      //validation for responese
     
      // -gua perlu create product list, as productList misal 
      const product = await Product_List.create({
        productName,
        isDeleted : 1,
        productPicture : "custom",
        productPrice,
        productDosage,
        productDescription
      }
      )

      // looping boleh [{productId,qty},...]
      for ( let i = 0; i < ingredients.length; i++){
      const recipe = await Product_Recipe.create({
        productId : product?.productId,
        quantity : ingredients[i]?.quantity,
        ingredientProductId : ingredients[i]?.ingredientProductId
      })
      // //logic handle unitnya juga
      // ambil product detail yg unit default sama unit secondary :
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

      // -if qty unit secondary < qty
      if(secUnit?.quantity < quantity){
      const remainStock = quantity - secUnit?.quantity
      const checker = Math.ceil(remainStock / mainUnit?.convertion)
      const remainSecStock = remainStock % mainUnit?.convertion

        //      kondisi 1 . if qty unitprimary <checker ; email reject
        if(mainUnit?.quantity < checker){
          //masukin email
           throw ({ status : middlewareErrorHandling.BAD_REQUEST_STATUS,
            message : middlewareErrorHandling.NO_STOCK});
        }
        if(mainUnit?.quantity >= checker){

          await Product_Detail.update({
            quantity : secUnit?.quantity - checker
          },{
            where : {
              productId : recipe?.ingredientProductId,
              isDefault : true
            }
          })
          //(updateproductdetail secondsaryunit, qtybaru=  sisaqtysecondaryunit  save qty skrgnya!
          await Product_Detail.update({
            quantity : remainSecStock
          },{
            where : {
              productId : recipe?.ingredientProductId,
              isDefault : false
            }
          })
        }

      }
      // -if qty unit secondary <= qty
      if(secUnit?.quantity < quantity){
        //save qty lama ke revereseStcock array
        reverseStock.push({
          userId : userId, 
          productId : product?.productId, 
          ingredientProductId : recipe?.ingredientProductId,
          isDefault : false, 
          quantity : secUnit?.quantity
        })
        // (updateproductdetail seoncadryunit, qtybaru = qtyskrg - qty save qty skrgnya! qtyskrg primary ambil dari productDetailmainunit
        await Product_Detail.update({
          quantity : secUnit?.quantity - quantity
        },{
          where : {
              productId : recipe?.ingredientProductId,
              isDefault : false
          }
        })
      }
      }

      // -masukin k transaction list dan detail, pisah transaction baru
      // create transaction list :
      // transactionId int AI PK 
      // userId int 
      // total int 
      // transport int 
      // subtotal int 
      // paymentProof varchar(125) 
      // statusId int 
      // createdAt datetime 
      // updatedAt

      // create trasnsaction detail :
      // detailId int AI PK 
      // transactionId int 
      // price int 
      // quantity int 
      // totalPrice int 
      // productId

      res.status(200).json({ 
        type : "success",
        message : "Data berhasil dimuat",
        data : userlist
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
