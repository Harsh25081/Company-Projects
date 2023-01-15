const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    Question : {type:String,required:true,unique:true},
    Option1:{type:String,required:true},
    Option2:{type:String,required:true},
    Option3:{type:String,required:true},
    Option4:{type:String,required:true},
    CorrectAnswer:{type:String,required:true},
    attachment:{type:String}
})

module.exports = mongoose.model("Question",questionSchema)