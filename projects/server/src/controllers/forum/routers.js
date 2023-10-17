const express = require("express")
const forum = require("./index.js")
const { verifyUser, verifyAdmin } = require("../../middleware/token.verify.js")

const router = express.Router()

router.get("/", verifyUser, forum.getQuestions)
router.get("/public", forum.getQuestionsForPublic)
router.post("/", verifyUser, forum.postQuestion)
router.patch("/", verifyAdmin, forum.answerQuestion)
router.get("/admin", verifyAdmin, forum.getUnansweredQuestions)
router.patch("/:qnaId", verifyUser, forum.deleteQuestion)

module.exports = router