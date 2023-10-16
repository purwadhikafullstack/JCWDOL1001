const { ValidationError } = require("yup")
const { User_Account,User_Address, User_Profile } = require("../../model/relation.js")
const validation = require("./validation.js")
const {REDIRECT_URL,GMAIL} = require("../../config/index.js")
const {RegisterValidationSchema, VerifyValidationSchema, UpdatePasswordValidationSchema ,
    PasswordValidationSchema, ForgotPassValidationSchema } = require("./validation.js")
const db = require("../../model/index.js")
const {helperToken, helperEncryption, helperOTP, helperTransporter} = require("../../helper/index.js")
const { middlewareErrorHandling } = require("../../middleware/index.js")
const moment = require ("moment")
const path = require("path")
const fs = require("fs")
const handlebars = require("handlebars")
const cloudinary = require("cloudinary");
const { LINK_EXPIRED_STATUS, LINK_EXPIRED } = require("../../middleware/error.handler.js")
const { capitalizeEachWords, trimString } = require("../../utils/index.js");


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        await validation.LoginValidationSchema.validate(req.body)

        const userExists = await User_Account?.findOne(
            {
                where: {email},
                include : {
                    model : User_Profile,
                    as : "userProfile"
                }
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
            roleId : userExists?.dataValues?.role,
            userId : userExists?.dataValues?.userId,
        });
        
        delete userExists?.dataValues?.password;

        res.header("Authorization", `Bearer ${accessToken}`)
            .status(200)
            .json({ 
                type : "success",
                message : `Welcome ${userExists.dataValues.email}`,
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
                include : [
                    {
                        model : User_Profile,
                        as : "userProfile"
                    },
                    {
                        model : User_Address,
                    },
                ],
                attributes : {
                    exclude : ["password"]
                }
            }
        );

        res.status(200).json({ 
            type : "success",
            message : "Data berhasil dimuat",
            user : users
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
            name : capitalizeEachWords(trimString(name)),
            phone : phone
        });

        // @delete password from response
        delete userAcc?.dataValues?.password;

        // @generate access token
        const accessToken = helperToken.createToken({ 
            UUID: userAcc?.dataValues?.UUID,
            name : name, 
            email : userAcc.dataValues?.email,
            roleId : userAcc?.dataValues?.role,
        });

        //@ send otp to email for verification
        const template = fs.readFileSync(path.join(process.cwd(), "templates", "verify.html"), "utf8");
        const html = handlebars.compile(template)({ name: (name), otp : (otpToken), link :(REDIRECT_URL + `/verify/reg-${accessToken}`) })

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
            .status(200)
            .json({
            message: "We have sent OTP and redirect link to your email address",
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

//otp dari body, gak perlu yup validator
//otp puisahin

const verify = async (req, res, next) => {
    try {
        // @create transaction
        const transaction = await db.sequelize.transaction(async()=>{   
        //@ grab input
        const { otp, gender,birthdate} = req.body;  
        delete req.body.otp
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
        
        // @verify otp
        if (otp !== users?.dataValues?.otp) throw (
            { status : 400, 
            message : middlewareErrorHandling.INVALID_CREDENTIALS_OTP});

        // @check if otp is expired
        const isExpired = moment().isAfter(users?.dataValues?.expiredOtp);
        if (isExpired) throw ({ status : middlewareErrorHandling.LINK_EXPIRED_STATUS,
             message : middlewareErrorHandling.LINK_EXPIRED });

        // @langsung input, janlup verify dibikin 1
        await User_Account?.update({ status : 1, otp : null, expiredOtp : null }, { where : { uuid : req.user.UUID} });
        await User_Profile.update({
            gender,
            birthdate},
            {where : { 
            userId : users?.dataValues?.userId
        }});
        // await User_Address.create({
        //     address , 
        //     province, 
        //     city, 
        //     district, 
        //     postalCode,
        //     userId : users?.dataValues?.userId
        // });
                        
        // oper data ke backend + message
        //@ get user from uuid
        const result = await User_Account?.findOne(
            { 
                where : { UUID : req.user.UUID },
                attributes : { exclude : ["password","otp","expiredOtp"] }
            }
        );
        
        const profile = await User_Profile?.findOne({
            where : {userId : users?.dataValues?.userId }
        })
         // @generate access token
         const accessToken = helperToken.createToken({ 
            UUID: result?.dataValues?.UUID, 
            email : result?.dataValues?.email,
            roleId : result?.dataValues?.role,
        });
       
        // @return response
        res
        .header("Authorization", `Bearer ${accessToken}`)
        .status(200).json({ message : "Account verified successfully",  data : result, profile : profile})
    }); 
    } catch (error) {
        next(error)
    }
}

const resendOtp = async (req, res, next) => {
    try {
        // @create transaction
        const transaction = await db.sequelize.transaction(async()=>{   
        const {email} = req.body
        // const email = req.user.email
        // @grab req.user 
        const otpToken =  helperOTP.generateOtp()

        await User_Account?.update({
            otp : otpToken,
            expiredOtp : moment().add(7,'h').add(30,'m').format("YYYY-MM-DD HH:mm:ss")
        }, {where : {email : email}});

        const user = await User_Account.findOne({
            where: {email},
            include : {
                    model : User_Profile,
                    as : "userProfile"
                }
        })
        // const profile = await User_Profile.findOne({where: {userId :user?.userId}})

        // @generate access token
        const accessToken = helperToken.createToken({ 
            name : user?.user_profile?.name,
            UUID: user?.UUID, 
            email : email,
            roleId : user?.role,
        });


        //@ send otp to email for verification
        const template = fs.readFileSync(path.join(process.cwd(), "templates", "verify.html"), "utf8");

        const html = handlebars.compile(template)({ name: (user?.user_profile?.name), otp : (otpToken), link :(REDIRECT_URL + `/verify/reg-${accessToken}`) })


        const mailOptions = {
            from: `Apotech Team Support <${GMAIL}>`,
            to: email,
            subject: "Verify Account",
            html: html}

            helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
                if (error) throw error;
                console.log("Email sent: " + info.response);
            })

        // @return response
        res
            .status(200)
            .json({
            message: "We have resent OTP to your email address",
            // userAcc
        });
    }); 
    } catch (error) {
        next(error)
    }
}

const changePassword = async (req, res, next) => {
    try{
        const {userId} = req.params;
        const {oldPassword, newPassword} = req.body;

        await validation.UpdatePasswordValidationSchema.validate(req.body);

        const users = await User_Account.findOne({where : {userId : userId}});
        if(!users) throw ({status : 400, message : middlewareErrorHandling.USER_DOES_NOT_EXISTS})

        const isPasswordCorrect = helperEncryption.comparePassword(oldPassword, users?.dataValues?.password)
        if (!isPasswordCorrect) throw ({ 
            status : middlewareErrorHandling.BAD_REQUEST_STATUS,
            message : middlewareErrorHandling.INCORRECT_PASSWORD 
        });

        const hashedPassword = helperEncryption.hashPassword(newPassword);

        const userUpdated = await User_Account?.update({password : hashedPassword},{where : {userId : userId}})
        delete userUpdated?.dataValues?.password;
        res.status(200).json({ message : "Password changed!"});
    }catch(error){
        next(error);
    }
}

const changeProfilePicture = async (req, res, next) => {
    try{
        const {userId} = req.params;

        const userExists = await User_Profile?.findOne({where : {userId : userId}})
        if(!userExists) throw ({status : 400, message : middlewareErrorHandling.USER_DOES_NOT_EXISTS})

        if(!req.file){
            return next({
                status : middlewareErrorHandling.BAD_REQUEST_STATUS,
                message : middlewareErrorHandling.IMAGE_NOT_FOUND
            });
        }
        
        if(userExists?.dataValues?.profilePicture){
            cloudinary.v2.api.delete_resources([`${userExists?.dataValues?.profilePicture}`],{type : `upload`,resource_type : 'image'});
        }

        await User_Profile?.update({profilePicture : req?.file?.filename},{where : {userId : userId}});
        res.status(200).json({type : "success", message : "Profile picture uploaded.", imageURL : req?.file?.filename});

    }catch(error){
        cloudinary.v2.api.delete_resources([`${req?.file?.filename}`],{type : `upload`,resource_type : 'image'});
        next(error);
    }
}

const changeEmailOtp = async (req, res, next) => {
    try{
        const{userId} = req.params;

        const otpToken =  helperOTP.generateOtp();

        const users = await User_Account.findOne({where : {userId : userId}});
        if(!users) throw ({status : 400, message : middlewareErrorHandling.USER_DOES_NOT_EXISTS});

        await User_Account?.update({
            otp : otpToken,
            expiredOtp : moment().add(7,'h').add(30,'m').format("YYYY-MM-DD HH:mm:ss")
        }, {where : {userId : userId}});

        const user = await User_Account.findOne({
            where: {userId : userId},
            include : {
                    model : User_Profile,
                    as : "userProfile"
                }
        })

        const accessToken = helperToken.createToken({ 
            name : user?.user_profile?.name,
            UUID: user?.UUID, 
            email : user?.email,
            roleId : user?.role,
        });

        const template = fs.readFileSync(path.join(process.cwd(), "templates", "emailverify.html"), "utf8");
        const html = handlebars.compile(template)({otp : (otpToken)})
    
        const mailOptions = {
            from: `Apotech Team Support <${GMAIL}>`,
            to: user?.email,
            subject: "OTP for change email",
            html: html}
    
            helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
                if (error) throw error;
        })
        res.status(200).json({message : "Please check your new email to get the OTP."}); 
    }catch(error){
        next(error);
    }
}

const changeEmail = async (req, res, next) => {
    try{
        const{userId} = req.params;
        const{email, otp} = req.body;
        
        await validation.UpdateEmailValidationSchema.validate({email});

        const users = await User_Account.findOne({where : {userId : userId}});
        if(!users) throw ({status : 400, message : middlewareErrorHandling.USER_DOES_NOT_EXISTS});

        const userEmails = await User_Account.findOne({where : {email : email}});
        if(userEmails) throw ({status : 400, message : middlewareErrorHandling.EMAIL_HAS_BEEN_USED});
        
        if (otp !== users?.dataValues?.otp) throw (
            { status : 400, 
            message : middlewareErrorHandling.INVALID_CREDENTIALS_OTP });

        // @check if otp is expired
        const isExpired = moment().isAfter(users?.dataValues?.expiredOtp);
        if (isExpired) throw ({ status : middlewareErrorHandling.LINK_EXPIRED_STATUS,
             message : middlewareErrorHandling.LINK_EXPIRED });

        const userUpdated = await User_Account?.update({email : email, otp : null, expiredOtp : null},{where : {userId : userId}});
        res.status(200).json({message : "Email changed!"});

        
    }catch(error){
        next(error);
    }
}

const changeProfileData = async (req, res, next) => {
    try{
        const {userId} = req.params;
        const { name, phone, gender, birthdate } = req.body

        const profileData = {
            name: capitalizeEachWords(trimString(name)),
            phone,
            gender,
            birthdate
        }

        await validation.UpdateProfileValidationSchema.validate(profileData);

        const users = await User_Profile.findOne({where : {userId : userId}});
        if(!users) throw ({status : 400, message : middlewareErrorHandling.USER_DOES_NOT_EXISTS});

        users.update(profileData,{where : {userId : userId}});
        res.status(200).json({message : "Data changed!"});
    }catch(error){
        next(error)
    }
}

const getProfile = async (req,res,next) => {
    try{
        const {userId} = req.user;

        const data = await User_Profile.findOne({where : {userId : userId}});
        if(!data) throw ({status : 400, message : middlewareErrorHandling.USER_DOES_NOT_EXISTS});

        res.status(200).json({message : "success", data : data})
    }catch(error){
        next(error)
    }
}

//forgotpassword (get email, send verif to reset password)
const forgotPass = async ( req,res,next) => {
    try{
        const transaction = await db.sequelize.transaction(async()=>{     
        // @ email validation
        const  {email}  = req.body;

        //@input validation
        await ForgotPassValidationSchema.validate(email); 

        
        //@ get id from email
        // @first, find the user's data
        const userResult = await User_Account?.findOne( { where : {email: email } });
        // const profileResult = await User_Profile?.findOne( { where : {userId : userResult?.userId}})
        await User_Account?.update({
            otp : "RESET"
        },{where : {
            email : email
        }})
         // @generate access token
         const accessToken = helperToken.createToken({ 
            UUID: userResult.UUID,
            role : userResult.role,
        }); 

        //@send verification email
        const template = fs.readFileSync(path.join(process.cwd(), "templates", "forgotPass.html"), "utf8");
        const html = handlebars.compile(template)({link :(REDIRECT_URL + `/reset-password/reset-${accessToken}`) })
        
        const mailOptions = {
            from: `Apotech Team Support <${GMAIL}>`,
            to: email,
            subject: "Forgot Password",
            html: html}
            helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
                if (error) throw error;
                console.log("Email sent: " + info.response);
            })
            // @return response
           res
               .status(200)
               .json({
               message: "We have sent verification email for reset password",
           });
        });

    } catch (error){
        next(error)
    }
}

//reset password
const reset = async(req,res,next) =>{
    try{
        //@grab password from res; validate and encrypt it into hashedpassword
        const {password} = req.body;

        //@password template validation
        await PasswordValidationSchema.validate(password);
        const hashedPassword = helperEncryption.hashPassword(password);
        const result = await User_Account.findOne({where : {
            UUID : req?.user?.UUID,
            otp : "RESET"
        }})
        if(!result){
            throw ({status : 410, message : middlewareErrorHandling.ONLY_ONCE});
        }
        //@update user data
        await User_Account?.update({ password: hashedPassword, otp : null}, {
            where: {
                UUID : req?.user?.UUID
            }
          });
         
        // @ send rexponse message only, cause they need to relogin
        res
        .status(200)
        .json({
        message: "Success! Your new password is ready to use. Go back to login page",
    });
    } catch(error){
        next(error)
    }
}

module.exports = {
   login,
   keepLogin,
   register,
   verify,
   resendOtp,
   changeEmail,
   changePassword,
   changeProfileData,
   changeProfilePicture,
   changeEmailOtp,
   getProfile,
   forgotPass,
   reset
}