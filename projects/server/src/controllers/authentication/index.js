const { ValidationError } = require("yup")
const { User_Account,User_Address,User_Profile } = require("../../model/user.js")
const validation = require("./validation.js")
const {REDIRECT_URL,GMAIL} = require("../../config/index.js")
const {RegisterValidationSchema, VerifyValidationSchema  } = require("./validation.js")
const db = require("../../model/index.js")
const {helperToken, helperEncryption, helperOTP, helperTransporter} = require("../../helper/index.js")
const { middlewareErrorHandling } = require("../../middleware/index.js")
const moment = require ("moment")
const path = require("path")
const fs = require("fs")
const handlebars = require("handlebars")


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

// @register process
const register= async (req, res, next) => {
    try {
        // @create transaction
        const transaction = await db.sequelize.transaction(async()=>{      

        // @validation
        const { name, password, email, phone} = req.body;
        await RegisterValidationSchema.validate(req.body);

        // @check if user already exists via email address
        const userExists = await User_Account?.findOne({ where: { email } });
        if (userExists) throw ({ status : 400, message : USER_ALREADY_EXISTS });
        // @create user account and user profile -> encypt password
        const otpToken =  helperOTP.generateOtp()
        const hashedPassword = helperEncryption.hashPassword(password);
        const userAcc = await User_Account?.create({
            password : hashedPassword,
            email : email,
            otp : otpToken,
            expiredOtp : moment().add(7,'h').add(30,'m').format("YYYY-MM-DD HH:mm:ss")
        });
        await User_Profile?.create({
            userId : userAcc?.dataValues?.userId,
            name : name,
            phone : phone
        });

        // @delete password from response
        delete userAcc?.dataValues?.password;

        // @generate access token
        const accessToken = helperToken.createToken({ 
            UUID: userAcc?.dataValues?.UUID, 
            email : userAcc.dataValues?.email,
            roleId : userAcc?.dataValues?.role,
            otp : otpToken
        });

        //@ send otp to email for verification
        const template = fs.readFileSync(path.join(process.cwd(), "templates", "verify.html"), "utf8");
        const html = handlebars.compile(template)({ name: (name), otp : (otpToken), link :(REDIRECT_URL + `/auth/verify/reg-${accessToken}`) })

        const mailOptions = {
            from: `Apotech Team Support <${GMAIL}>`,
            to: email,
            subject: "Verify Account",
            html: html}
            console.log(mailOptions)

            helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
                if (error) throw error;
                console.log("Email sent: " + info.response);
            })

        // @return response
        res
            .header("Authorization", `Bearer ${accessToken}`)
            .status(200)
            .json({
            message: "We have sent OTP to your email address",
            // userAcc
        });
        
        });  

    } catch (error) {

        // @check if error from validation
        if (error instanceof ValidationError) {
            return next({ status : middlewareErrorHandling.BAD_REQUEST_STATUS, message : error?.errors?.[0] })
        }
        next(error)
    }
}

const verify = async (req, res, next) => {
    try {
        // @create transaction
        const transaction = await db.sequelize.transaction(async()=>{   
        //@ grab input
        const { gender, birthdate, address, province, city, district, postalCode } = req.body;  
          
        //@ get user from uuid
        const users = await User_Account?.findOne({ where : { UUID : req.user.UUID }});
        if (!users) throw ({ status : 400, message : middlewareErrorHandling.USER_DOES_NOT_EXISTS });
        // @ambil tokennya, cek apakah user udah verify? kalau iya, return
        if (users?.dataValues?.status == 1) throw (
            {
                status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
                message : middlewareErrorHandling.BAD_REQUEST
            })
        // @cek apakah formatnya valid, terus data user address dan user profilenya uda valid belum
        await VerifyValidationSchema.validate(req.body)
        
        // @verify token
        if (req.user.otp !== users?.dataValues?.otp) throw (
            { status : 400, 
            message : middlewareErrorHandling.INVALID_CREDENTIALS });

        // @check if token is expired
        const isExpired = moment().isAfter(users?.dataValues?.expiredOtp);
        if (isExpired) throw ({ status : 400, message : INVALID_CREDENTIALS });

        // @langsung input, janlup verify dibikin 1
        await User_Account?.update({ status : 1, otp : null, expiredOtp : null }, { where : { uuid : req.user.UUID} });
        await User_Profile.update({
            gender : gender,
            birthdate : birthdate},
            {where : { 
            userId : users?.dataValues?.userId
        }});
        await User_Address.create({
            address : address , 
            province : province, 
            city : city, 
            district : district, 
            postalCode : postalCode,
            userId : users?.dataValues?.userId
        });
                        
        // oper data ke backend + message
        //@ get user from uuid
        const result = await User_Account?.findOne(
            { 
                where : { UUID : req.user.UUID },
                attributes : { exclude : ["password","otp","expiredOtp"] }
            }
        );
         // @generate access token
         const accessToken = helperToken.createToken({ 
            UUID: result?.dataValues?.UUID, 
            email : result?.dataValues?.email,
            roleId : result?.dataValues?.role,
        });
       
        // @return response
        res.status(200).json({ message : "Account verified successfully",  data : result, token : accessToken })
    }); 
    } catch (error) {
        next(error)
    }
}



module.exports = {
   login,
   keepLogin,
   register,
   verify
}