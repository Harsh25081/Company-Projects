const jwt = require('jsonwebtoken')
const adminModel = require("../models/userModel")

const isValidEmail = /^([a-zA-Z0-9_\.\-])+\@([a-z])+\.([a-z]{2,3})$/i
const isValidPhone = /^[0]?[6789]\d{9}$/

exports.CreateUser = async (req,res)=>{
    try {
        let data = req.body
        let {name,email,phone,password,department}=data
        if(!name)return res.status(400).send({status:false,message:"Pls provide Name"})
        if(!email)return res.status(400).send({status:false,message:"Pls provide Email"})
        if(!isValidEmail.test(email))return res.status(400).send({status:false,message:"Pls provide Valid Email"})
        if(!phone)return res.status(400).send({status:false,message:"Pls provide Phone"})
        if(!isValidPhone.test(phone))return res.status(400).send({status:false,message:"Pls provide Valid Phone"})
        if(!password)return res.status(400).send({status:false,message:"Pls provide Password"})
        if(password.length<8 || password.length>15)return res.status(400).send({status:false,message:"Pls provide password of length 8 - 15"})

        const CreateAdmin = await adminModel.create(data);
        return res.status(201).send({status:true,message:"Created Successfully",data:CreateAdmin})
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

exports.AdminLogin = async (req,res)=>{
    try {
        let {email,password}=req.body
        if(!email)return res.status(400).send({status:false,message:"Pls provide Email"})
        if(!isValidEmail.test(email))return res.status(400).send({status:false,message:"Pls provide Valid Email"})
        if(!password)return res.status(400).send({status:false,message:"Pls provide Password"})
        let adminexists = await adminModel.findOne({email,password})
        if(!adminexists)return res.status(400).send({status:false,message:"No Admin exists with this Email and Password"})
        if(adminexists.type!="admin")return res.status(400).send({status:false,message:"You are Not an Admin"})
        let token = jwt.sign({
            AdminId : adminexists._id
        },
        "SecretKey",
        {expiresIn : "24h"}
        )
        return res.status(200).send({status:true,message:"Login Successful",token})
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

exports.StudentLogin = async ()=>{
    try {
        let {email,password}=req.body
        if(!email)return res.status(400).send({status:false,message:"Pls provide Email"})
        if(!isValidEmail.test(email))return res.status(400).send({status:false,message:"Pls provide Valid Email"})
        if(!password)return res.status(400).send({status:false,message:"Pls provide Password"})
        let studentexists = await adminModel.findOne({email,password})
        if(!studentexists)return res.status(400).send({status:false,message:"No student exists with this Email and Password"})
        if(studentexists.type!="student")return res.status(400).send({status:false,message:"You are Not a Student"})
        let token = jwt.sign({
            studentId : studentexists._id
        },
        "SecretKey",
        {expiresIn : "24h"}
        )
        return res.status(200).send({status:true,message:"Login Successful",token})
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}