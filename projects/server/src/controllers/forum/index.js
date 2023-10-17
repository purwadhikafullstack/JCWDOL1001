const { Op } = require("sequelize")
const { middlewareErrorHandling } = require("../../middleware/index.js")
const { Forum, User_Profile,User_Account } = require("../../model/relation.js")
const moment = require ("moment")


const getQuestions = async (req, res, next) => {
    try {
        const { page, sortDate, filterQuestion } = req.query;
    
        const currentPage = page ? parseInt(page) : 1;

        const options = {
            offset : currentPage > 1 ? parseInt(currentPage-1)*10 : 0,
            limit : 10,
        }

        const filter = {}
        const sort = [[`answer`,'ASC'],[`createdAt`, sortDate ? sortDate : "DESC"]]

        if(req.user.roleId !== 1) {
            filter.userId = {"userId" : req.user.userId}
        }

        if(filterQuestion) filter.question = {"question" : {[Op.like]: `%${filterQuestion}%`}}
        
        const forums = await Forum.findAll({...options,
            where : {
                [Op.and] :
                [
                    filter.userId,
                    {"isDeleted" : 0},
                    filter.question
                ]
            },
            include : {
                model :User_Profile,
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
        const { page, filterQuestion } = req.query;

        const filter = {}
    
        const currentPage = page ? parseInt(page) : 1;

        const options = {
            offset : currentPage > 1 ? parseInt(currentPage-1)*10 : 0,
            limit : 10,
        }

        if(filterQuestion) filter.question = {"question" : {[Op.like]: `%${filterQuestion}%`}}

        const forums = await Forum.findAll({...options,
            where : {
                [Op.and] :
                [
                    {answer:{ [Op.not] : null }},
                    {"isDeleted" : 0},
                    filter.question
                ]
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
        req.body.expiredDate = moment().add(1,"h")
        
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

const deleteQuestion = async (req, res, next) => {
    try {
        const condition = {qnaId : req.params.qnaId}

        if(req.user.roleId === 2){
            condition.userId = req.user.userId
        }

        const forumUser = await Forum.findOne({
            where : condition
        })

        if(!forumUser) throw ({
            status : middlewareErrorHandling.NOT_FOUND_STATUS,
            message : middlewareErrorHandling.DATA_NOT_FOUND
        })

        if(forumUser?.dataValues?.answer) throw ({
            status : middlewareErrorHandling.BAD_REQUEST_STATUS,
            message : middlewareErrorHandling.CANNOT_DELETE_ANSWERED_QUESTION
        })
        
        if(req.user.roleId === 2){
            const canDelete = moment().isSameOrBefore(moment(forumUser.expiredDate))
    
            if(!canDelete) throw ({
                status : middlewareErrorHandling.BAD_REQUEST_STATUS,
                message : middlewareErrorHandling.CANNOT_DELETE_QUESTION
            })
        }

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

const answerQuestion = async (req, res, next) => {
    try {
        const {answer,qnaId} = req.body
        //validate the answer(?)
        const qna = await Forum.findOne({where:{
            qnaId : qnaId
        }})
        const user = await User_Account.findOne({where:{
            userId : qna.dataValues?.userId
        } })
        const profile = await User_Profile.findOne({where:{
            userId : qna.dataValues?.userId
        } })
        await Forum.update(
            {
                answer , 
                adminId : req.user.userId
            },{
            where : {
                qnaId : qnaId
            }
        })
        //send only once
        if(qna.dataValues?.answer === null){
        const template = fs.readFileSync(path.join(process.cwd(), "projects/server/templates", "getAnAnswer.html"), "utf8");
        const html = handlebars.compile(template)({name : profile?.dataValues?.name ,answer: answer, question : qna.dataValues?.question})
    
        const mailOptions = {
            from: `Apotech Team Support <${GMAIL}>`,
            to: user?.dataValues?.email,
            subject: "Pertanyaan kamu di Forum Apotech terjawab",
            html: html}
    
            helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
                if (error) throw error;
        })
        }
        res.status(200).json({
			type : "success",
			message : "Pertanyaan berhasil dijawab",
		});
    }catch (error) {
        next(error)
    }
}

const getUnansweredQuestions = async (req, res,next) => {
    try {
        const { page, sortDate, filterQuestion } = req.query;
    
        const currentPage = page ? parseInt(page) : 1;

        const options = {
            offset : currentPage > 1 ? parseInt(currentPage-1)*10 : 0,
            limit : 10,
        }
 
        const filter = {}
        const sort =  [[`createdAt`, sortDate ? sortDate : "DESC"]]

        if(filterQuestion) filter.question = {"question" : {[Op.like]: `%${filterQuestion}%`}}
        
        const forums = await Forum.findAll({...options,
            where : {
                [Op.and] :
                [
                    {"isDeleted" : 0},
                    filter.question
                ]
            },
            include : {
                model :User_Profile,
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
    }
    catch (error) {
        next(error)
    }
}

module.exports={
    getQuestions,
    getQuestionsForPublic,
    postQuestion,
    deleteQuestion,
    answerQuestion,
    getUnansweredQuestions
}