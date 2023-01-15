const express = require("express")
const { CreateUser, AdminLogin, StudentLogin } = require("../controllers/userController")
const { CreateQuestion, GetAllQuestion } = require("../controllers/questionController")
const router = express.Router()

router.post("/test-me",(req,res)=>{
    res.send("This is the test API!!")
})

router.post("/createuser",CreateUser)
router.post("/adminlogin",AdminLogin)

router.post("/studentlogin",StudentLogin)

router.post("/createquestion",CreateQuestion)
router.get("/getallquestion",GetAllQuestion)

module.exports = router