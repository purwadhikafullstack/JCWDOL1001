const {middlewareErrorHandling} = require("../../middleware/index.js");
const {Product_Recipe, Product_List, Product_Unit, Product_Detail, Product_History} = require("../../model/relation.js")
const {Op} = require("sequelize")
const cloudinary = require("cloudinary");
const {inputProductValidationSchema, updateProductValidationSchema, updateMainStockValidationSchema } = require("./validation.js")
const {ValidationError} = require("yup");

const getUser = async( req, res, next ) => {
    try{
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

  const addCustomProduct = async( req, res, next ) => {
    try{
        // AddCustomProduct
        // input requestnya ( data ingredient : [{productId,qty}, ...], 
        // userId, productName, productPrice, productdosage, productDescription, daTA TRANSPORT DLL)
        const {ingredients, userId, productName,
        productPrice, productDosage, productDescription, quantity,
        transports}= req.body
        //validation for responese
       
        // -gua perlu create product list, as productList misal 
        const product = await Product_List.create({
          // productId AI
          // productName (input)
          // isDeleted 1
          // productPicture assets
          // productPrice (input)
          // productDosage (input) 
          // productDescription (input) 
          productName,
          isDeleted : 1,
          productPicture : "",
          productPrice,
          productDosage,
          productDescription
        }
        )

        let reverseStock = []
        // looping boleh [{productId,qty},...]
        for ( let i = 0; i < ingredients.length; i++){

        
        // 1.create product recipe sebanyak jumlah bahannya :
        // recipeId int AI
        // productId (productId dari productList)
        // quantity (input item looping jg)
        // ingredientProductId (input item looping)
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
            throw new error
          }
          //      kondisi 2. if qty unit primary >= checker, brrti 
          if(mainUnit?.quantity >= checker){
            //save qty lama ke revereseStcock array
            //(updateproductdetail main unit, qtybaru =  qtyskrg - checker , save qty skrgnya!
            await Product_Detail.update({
              quantity : secUnit?.quantity - quantity
            },{
              where : {

              }
            })
            //(updateproductdetail secondsaryunit, qtybaru=  sisaqtysecondaryunit  save qty skrgnya!
            await Product_Detail.update({
              quantity : secUnit?.quantity - quantity
            },{
              where : {

              }
            })
          }

        }
        // -if qty unit secondary <= qty
        if(secUnit?.quantity < quantity){
          //save qty lama ke revereseStcock array
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
        
        
        // -kirim email berupa notifikasi  ke user, kalau produk uda berhasil dibuat, tinggal bayar 
        

    
      res.status(200).json({ 
        type : "success",
        message : "Data berhasil dibuat"
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

