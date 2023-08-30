const { ValidationError } = require("yup")
const { User_Account } = require("../../model/user.js")
const validation = require("./validation.js")
const encryption = require("../../helper/encryption.js")
const tokenHelper = require("../../helper/token.js")
const errorMiddleware = require("../../middleware/error.handler.js")

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        await validation.LoginValidationSchema.validate(req.body)

        const userExists = await User_Account?.findOne(
            {
                where: {email}
            }
        )

        if (!userExists) throw ({
            status : errorMiddleware.NOT_FOUND_STATUS, 
            message : errorMiddleware.EMAIL_NOT_FOUND 
        })
        
        const isPasswordCorrect = encryption.comparePassword(password, userExists?.dataValues?.password)

        if (!isPasswordCorrect) throw ({ 
            status : errorMiddleware.BAD_REQUEST_STATUS,
            message : errorMiddleware.INCORRECT_PASSWORD 
        });
        
        const accessToken = tokenHelper.createToken({ 
            id: userExists?.dataValues?.userId, 
            email : userExists?.dataValues?.email,
            roleId : userExists?.dataValues?.role
        });
        
        delete userExists?.dataValues?.password;

        res.header("Authorization", `Bearer ${accessToken}`)
            .status(200)
            .json({ 
                type : "success",
                user : userExists 
            })

    } catch (error) {
        if (error instanceof ValidationError) {
            return next({ 
                status : errorMiddleware.BAD_REQUEST_STATUS, 
                message : error?.errors?.[0] 
            })
        }
        next(error)
    }
}

const keepLogin = async (req, res, next) => {
    try {
        const users = await User_Account?.findOne(
            { 
                where : {
                    userId : req.user.id
                },
                attributes : {
                    exclude : ["password"]
                }
            }
        );

        res.status(200).json({ 
            type : "success",
            message : "Data berhasil dimuat",
            users : users
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
   login,
   keepLogin
}