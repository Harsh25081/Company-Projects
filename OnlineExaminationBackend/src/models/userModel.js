const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {type:String,required:true,unique:true},
    email : {type:String,required:true,unique:true},
    phone : {type:Number,required:true,unique:true},
    password : {type:String,required:true},
    type : {type:String,default:"student",enum:["student","admin"]},
    department : {type:String}
})

module.exports = mongoose.model("user",userSchema)