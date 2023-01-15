const aws = require("aws-sdk")
const  mongoose  = require("mongoose")
const questionModel = require("../models/questionModel")
const isValidObjectId = mongoose.Schema.Types.ObjectId

aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
      
        let s3 = new aws.S3({ apiVersion: '2006-03-01' }); 

        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",  
            Key: "OnLineExamination/" + file.originalname,  
            Body: file.buffer
        }

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            console.log("file uploaded succesfully")
            return resolve(data.Location)
        })
    })
}

exports.CreateQuestion = async (req,res)=>{
    try {
        let data=req.body
        let files=req.files
        let {Question,Option1,Option2,Option3,Option4,CorrectAnswer}=data
        if(!Question)return res.status(400).send({status:false,message:"Pls provide Question"})
        let checkQueUnique = await questionModel.findOne({Question})
        if(checkQueUnique)return res.status(400).send({status:false,message:"Pls provide the unique Question"})
        if(!Option1)return res.status(400).send({status:false,message:"Pls provide Option1"})
        if(!Option2)return res.status(400).send({status:false,message:"Pls provide Option2"})
        if(!Option3)return res.status(400).send({status:false,message:"Pls provide Option3"})
        if(!Option4)return res.status(400).send({status:false,message:"Pls provide Option4"})
        if(!CorrectAnswer)return res.status(400).send({status:false,message:"Pls provide CorrectAnswer"})
        if(![Option1,Option2,Option3,Option4].includes(CorrectAnswer))
        return res.status(400).send({status:false,message:"CorrectAnswer only be from Option1,Option2,Option3,Option4"})

        if(files.length!=0){
            let attach = await uploadFile(files[0])
            data.attachment = attach
        }

        const CreateQuestion = await questionModel.create(data)
        return res.status(201).send({status:true,message:"Question Created Successfully",data:CreateQuestion})
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}


exports.GetAllQuestion = async (req,res)=>{
    try {
        const GetAllQuestion = await questionModel.find()
        return res.status(200).send({status:true,message:"Success",data:GetAllQuestion})
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

exports.UpdateQuestion = async (req,res)=>{
    try {
        const questionId = req.params.questionId
        if(!isValidObjectId.test(questionId))return res.status(400).send({status:false,message:"Pls provide valid questionId"})
        const checkQuestion = await questionModel.findById(questionId)
        if(!checkQuestion)return res.status(400).send({status:false,message:"No question Exists with this QuestionId"})

        const data = req.body
        if(Object.keys(data).length==0)return res.status(400).send({status:false,message:"Pls provide atleast one field to Update"})
        let {Question,Option1,Option2,Option3,Option4,CorrectAnswer}=data
        if(Question){
            let checkQueUnique = await questionModel.findOne({Question})
            if(checkQueUnique)return res.status(400).send({status:false,message:"Pls provide the unique Quuestion"})
        }
        if(CorrectAnswer){
            if(![Option1,Option2,Option3,Option4].includes(CorrectAnswer))
            return res.status(400).send({status:false,message:"CorrectAnswer only be from Option1,Option2,Option3,Option4"})
        }

        let files=req.files
        if(files.length!=0){
            let attach = await uploadFile(files[0])
            data.attachment = attach
        }

        const UpdateQuestion = await questionModel.findByIdAndUpdate(questionId,data,{new:true})
        return res.status(200).send({status:true,message:"Updated Successfully",data:UpdateQuestion})
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}