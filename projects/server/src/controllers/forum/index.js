const { Op } = require("sequelize")
const { middlewareErrorHandling } = require("../../middleware/index.js")
const { Forum, User_Profile, User_Account } = require("../../model/relation.js")
const moment = require ("moment")
const path = require("path")
const fs = require("fs")
const handlebars = require("handlebars")
const {GMAIL} = require("../../config/index.js")
const {helperTransporter} = require("../../helper/index.js")


const getQuestions = async (req, res, next) => {
    try {
        const { page } = req.query;
    
        const currentPage = page ? parseInt(page) : 1;

        const options = {
            offset : currentPage > 1 ? parseInt(currentPage-1)*10 : 0,
            limit : 10,
        }

        const filter = {}
        const sort = []

        if(req.user.roleId > 1) {
            filter.userId = {"userId" : req.user.userId}
            sort.push([`updatedAt`, "DESC"])
        }else {
            sort.push([`createdAt`,"ASC"])
        }

        const forums = await Forum.findAll({...options,
            where : {
                [Op.and] :
                [
                    filter.userId,
                    {"isDeleted" : 0}
                ]
            },
            include : {
                model :User_Profile
            },
            order : sort
        })

        const total = req.user.roleId === 1 ? await Forum.count({where : {isDeleted:0}}) : await Forum.count({where : {isDeleted:0,userId : req.user.userId}})

        const pages = Math.ceil(total/options.limit)

        res.status(200).json({
			type : "success",
			message : "Data berhasil dimuat",
            currentPage : +page ? +page : 1,
            totalPage : pages,
            totalQuestions : total,
            productLimit : options.limit,
			data : forums,
		});
    }catch (error) {
        next(error)
    }
}

const getQuestionsForPublic = async (req, res, next) => {
    try {
        const { page } = req.query;
    
        const currentPage = page ? parseInt(page) : 1;

        const options = {
            offset : currentPage > 1 ? parseInt(currentPage-1)*10 : 0,
            limit : 10,
        }

        const forums = await Forum.findAll({...options,
            where : {
                answer:{
                    [Op.not] : null
                },
                isDeleted : 0
            },
            include : {
                model :User_Profile
            },
            order : [[`updatedAt`, "DESC"]]
        })

        const total = await Forum.count({where : {isDeleted:0,answer:{[Op.not]:null}}})

        const pages = Math.ceil(total/options.limit)

        res.status(200).json({
			type : "success",
			message : "Data berhasil dimuat",
            currentPage : +page ? +page : 1,
            totalPage : pages,
            totalQuestions : total,
            productLimit : options.limit,
			data : forums
		});
    }catch (error) {
        next(error)
    }
}

const postQuestion = async (req, res, next) => {
    try {
        req.body.userId = req.user.userId
        
        const forums = await Forum.create(req.body)

        res.status(200).json({
			type : "success",
			message : "Pertanyaan berhasil dibuat",
			data : forums
		});
    }catch (error) {
        next(error)
    }
}

const postAnswer = async (req, res, next) => {
    try {
        req.body.adminId = req.user.userId
        
        await Forum.update(req.body,{
            where : {
                qnaId : req.params.qnaId
            }
        })

        const forum = await Forum.findOne({
            where : {
                qnaId : req.params.qnaId
            },
            include : {
                model: User_Profile,
                include : {
                    model : User_Account,
                    attributes : ['email']
                }
            }
        })

        const template = fs.readFileSync(path.join(process.cwd(), "templates", "getAnAnswer.html"), "utf8");
        const html = handlebars.compile(template)({ name : forum.user_profile.name, question : forum.question, answer : forum.answer})

        const mailOptions = {
            from: `Apotech Team Support <${GMAIL}>`,
            to: forum.user_profile.user_account.email,
            subject: "Your question has been answered",
            html: html
        }

        helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
            if (error) throw error;
            console.log("Email sent: " + info.response);
        })


        res.status(200).json({
			type : "success",
			message : "Pertanyaan berhasil dijawab",
            data : forum
		});
    }catch (error) {
        next(error)
    }
}

const deleteQuestion = async (req, res, next) => {
    try {
        
        const forumUser = await Forum.findOne({
            where : {
                qnaId  : req.params.qnaId,
                userId : req.user.userId
            }
        })

        if(!forumUser) throw ({
            status : middlewareErrorHandling.NOT_FOUND_STATUS,
            message : middlewareErrorHandling.DATA_NOT_FOUND
        })

        if(forumUser?.dataValues?.answer) throw ({
            status : middlewareErrorHandling.BAD_REQUEST_STATUS,
            message : middlewareErrorHandling.CANNOT_DELETE_ANSWERED_QUESTION
        })
        
        const timeDeletion = moment(forumUser.createdAt).add(1,'h')
        
        const canDelete = moment().isSameOrBefore(timeDeletion)

        if(!canDelete) throw ({
            status : middlewareErrorHandling.BAD_REQUEST_STATUS,
            message : middlewareErrorHandling.CANNOT_DELETE_QUESTION
        })

        await Forum.update({isDeleted:1},{
            where : {
                qnaId : req.params.qnaId
            }
        })

        res.status(200).json({
			type : "success",
			message : "Pertanyaan berhasil dihapus",
		});
    }catch (error) {
        next(error)
    }
}


module.exports={
    getQuestions,
    getQuestionsForPublic,
    postQuestion,
    postAnswer,
    deleteQuestion,
}