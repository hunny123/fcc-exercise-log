const express = require('express')
const app = express()
const cors = require('cors')
const Exercise = require('./models/exercise')
const User = require('./models/user')
const db = require('mongoose')

require('dotenv').config()

db.connect(process.env.DB).then((res)=>console.log('connect mongo db'))
app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.post(`/api/users`,async(req,res)=>{
  const {username} = req.body
  const newUser = new User({username})
  const user = await newUser.save()
  res.json({username:user.username,_id:user._id})
})
app.get(`/api/users`,async(req,res)=>{
  const users = await User.find()
  const newUsers = users.map(item=>{return{username:item.username,_id:item._id}})
  res.json(newUsers)
})
app.post('/api/users/:userId/exercises',async(req,res)=>{
 const {userId} = req.params
 const user = await User.findOne({_id:userId})
 const body = req.body
 const date = req.body.date ? new Date(req.body.date).toDateString():new Date().toDateString()
 const newExercise = new Exercise({...body,username:user.username,userId,date})
 const exercise = await newExercise.save()
 delete exercise._doc.userId
 res.json({...exercise._doc,date:new Date(exercise.date).toDateString(),_id:userId})
})
app.get(`/api/users/:userId/logs`,async(req,res)=>{
 const {userId} = req.params
 const {from,to,limit} =req.query
 const user = await User.findOne({_id:userId})
 let filters = {userId:userId}
 if(from && to) {filters.date = { $gt :  from, $lt : to}} 
 const exercises = await Exercise.find({...filters}).limit(limit)
 const shapedExercise = exercises.map(item=>
        {return{description:item.description,duration:item.duration,date:new Date(item.date).toDateString()}})
 res.json({username:user.username,_id:userId,count:shapedExercise.length,log:shapedExercise})
  
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
