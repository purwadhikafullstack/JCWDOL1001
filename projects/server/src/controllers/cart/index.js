const { ValidationError } = require("yup")
const { User_Account,Cart, Product_Detail, Product_List} = require("../../model/relation.js")
const {UpdateCartValidationSchema, DeleteCartValidationSchema} = require("./validation.js")
const db = require("../../model/index.js")
const { middlewareErrorHandling } = require("../../middleware/index.js")

async function dataCart (userId){
    await Cart?.update({inCheckOut : 0},{where : {
        userId : userId,
    }})
    return await Cart?.findAll(
        {
            where : {
            userId : userId,
            // inCheckOut : 0
        },
        include : 
        [
          {
            model : Product_List,
            as: "cartList",
            attributes : ["productName","productPicture","productPrice"], 
            include:[
                {
                    model:Product_Detail,
                    attributes : ["quantity"],
                    where:{
                        isDefault : 1,
                        isDeleted : 0
                    }
                }
            ]
          }
        ],
    });
}

const getCart = async (req, res, next) => {
    try {
        //show any active product in cart for specific user
            //payload userId
            //findall where userId 
            //if null, then cart = []

            //grab user from UUid
            const user = await User_Account.findOne({where : {UUID : req?.user?.UUID}})
            //findall product in cart from userId 
            // const cartExists = await Cart?.findAll(
            //     {
            //         where : {
            //         userId : user?.userId
            //     },
            //     include : 
            //     [
            //       {
            //         model : Product_List,
            //         as: "cartList",
            //         attributes : ["productName","productPicture","productPrice"], 
            //         include:[
            //             {
            //                 model:Product_Detail,
            //                 attributes : ["quantity"],
            //                 where:{
            //                     isDefault : 1,
            //                     isDeleted : 0
            //                 }
            //             }
            //         ]
            //       }
            //     ],
            // });
            const cartExists = await dataCart(user?.userId)
            
          
            //try to connect any data needed, like product Name, etc according to ui/ux
            if(!cartExists){
                res.status(200).json({ 
                    message : "Cart Not Found",
                    data: []
                })
            } 
    
        res.status(200).json({ 
            message : "Cart Exists",
            data: cartExists
        })
    } catch (error) {
        next(error)
    }
}
//
const updateCart = async (req, res, next) => {
    try {
            //addToCart => from product page, add to cart
                // find apakah ada user, sm productIdnya, 
                // wuantity = quantity
                // kalau user dan product id gaada pas di search, buat baru dgn payload yg sama 

                //grab data from req.body
                const {productId, quantity} = req.body;
                //do validation
                 await UpdateCartValidationSchema.validate(req.body)
                //grab product details
                 const product = await Product_Detail?.findOne({where :
                     {
                        productId: productId, 
                        isDefault : 1, 
                        isDeleted : 0}
                    })
                //error handling kalau quantity > productStock.quantity, dan no product exist
                 if(!product) throw ({
                    status : middlewareErrorHandling.NOT_FOUND_STATUS, 
                    message : middlewareErrorHandling.PRODUCT_NOT_FOUND
                })
                if(quantity > product?.quantity) throw ({
                    status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
                    message : middlewareErrorHandling.REQUEST_EXCEED_LIMIT
                })
                //grab user from UUid
                const user = await User_Account.findOne({where : {UUID : req?.user?.UUID}})
                //find all product in cart from userId, bisa pake findorcreate 
                const cartExists = await Cart?.findOne(
                    {
                        where : {
                            userId : user?.userId,
                            productId : productId
                }});
                
                //if data exists in cart database 
                if(cartExists){
                    await Cart.update({quantity : quantity},{where:{
                        userId : user?.userId,
                        productId : productId
                    }})
                }       
                //if data not found in cart database
                if(!cartExists){
                    await Cart?.create({
                        userId : user?.userId,
                        productId : productId,
                        quantity : quantity
                    });
                } 

                const result = await Cart.findOne({where:{
                    userId : user?.userId,
                    productId : productId,
                }});
        
            res.status(200).json({ 
                message : "New product added to cart",
                data: result
            })
        } catch (error) {
            next(error)
        }
}


const totalProductCart = async (req, res, next) => {
    try {
            //totalProductCart => count every active products in cart for specific user
                //payload userId
                //countall(?)where userId 
                //if null, then total = 0

                //grab user from UUid
                const user = await User_Account.findOne({where : {UUID : req?.user?.UUID}})
                //find all product in cart from userId 
                const total = await Cart.sum('quantity', { where: { userId : user?.userId , inCheckOut : 0} }); 
            res.status(200).json({ 
                message : "Current Total Products in cart",
                total: total
            })
        } catch (error) {
            next(error)
        }
}

const checkOutCart = async (req,res,next) => {
    try {
        const {data} = req.body;
        // //do validation 

        //grab user from UUid
        await Promise.all(
        data.map(async (item) => {
            await Cart.update({
                inCheckOut : 1
            },{
                where: {
                  productId: item.productId,
                  userId : req.user?.userId
                }
              });  

        })
        )

    res.status(200).json({ 
        message : "Products has been moved to checkout list",
    })
} catch (error) {
    next(error)
}
}
const deleteProductCart = async (req, res, next) => {
    try {
                //deleteProductCart => drop table pake destroy where userId dan productId

                //grab data from req.body
                const {productId} = req.params;
                // //do validation
                // await DeleteCartValidationSchema.validate(req.body)
                //grab user from UUid
                const user = await User_Account.findOne({where : {UUID : req?.user?.UUID}})
                //find all product in cart from userId 
                await Cart.destroy({
                    where: {
                      productId: productId,
                      userId : user?.userId
                    }
                  });  

            res.status(200).json({ 
                message : "Product has been removed from cart",
            })
        } catch (error) {
            next(error)
        }
    }

module.exports = {
    getCart,
    checkOutCart,
    totalProductCart,
    updateCart,
    deleteProductCart
}