const mongoose =require('mongoose')

var exercise = new mongoose.Schema({
   username:{
    type:String,
    required:true
   },
   description:{
    type:String,
    required:true
   },
   duration:{
    type:Number,
    required:true
   },
   date:{
    type:Date,
    required:true
   },
   userId:{
    type:String,
    required:true
   }
})
module.exports = mongoose.model('Exercise',exercise)