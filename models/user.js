const mongoose =require('mongoose')

var user = new mongoose.Schema({
   username:{
    type:String,
    required:true
   }
})
module.exports = mongoose.model('User',user)