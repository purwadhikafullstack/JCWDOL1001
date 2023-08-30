const { ValidationError } = require("yup")
const { User_Account } = require("../../model/user.js")
const validation = require("./validation.js")
const {helperToken, helperEncryption} = require("../../helper/index.js")
const { middlewareErrorHandling } = require("../../middleware/index.js")

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
            status : middlewareErrorHandling.NOT_FOUND_STATUS, 
            message : middlewareErrorHandling.EMAIL_NOT_FOUND 
        })
        
        const isPasswordCorrect = helperEncryption.comparePassword(password, userExists?.dataValues?.password)

        if (!isPasswordCorrect) throw ({ 
            status : middlewareErrorHandling.BAD_REQUEST_STATUS,
            message : middlewareErrorHandling.INCORRECT_PASSWORD 
        });
        
        const accessToken = helperToken.createToken({ 
            UUID: userExists?.dataValues?.UUID, 
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
                status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
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
                    UUID : req.user.UUID
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