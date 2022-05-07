const express = require('express')

const router = express.Router()

const User= require('../models/customer')
const  jwt= require('jsonwebtoken')
router.get('/',async(req,res)=>{
    try{
       const user = await User.find()
       res.json(user)
    }
    catch(err){
        res.send('error' + err)
    }
    
})



router.post('/register',async(req,res)=>{
    const email=req.body.email
    const user=new User(
    {
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    phone:req.body.phone  
    })
    try{
      const us=await User.find({email})
      let payload={
        subject:us._id
       }
       let token=jwt.sign(payload,'secretkey')
       for(let item of us)
       {
            id=item._id 
       }
       var obj={
          id:id,
          token:token
       }
       res.json(obj)
    }catch(err)
    {
        res.send("already a user");
    }
    
    })


 router.post('/login',async(req,res)=>{
  try{
    const user = await User.findByCredentials(req.body.email,req.body.password);
    const email=req.body.email
    let us=await User.find({email})
    let id
    let payload={
     subject:us._id
    }
    let token=jwt.sign(payload,'secretkey')
    for(let item of us)
    {
         id=item._id 
    }
    var obj={
       id:id,
       token:token
    }
    res.json(obj)
  }catch(err)
  {

     res.send("error")
  }
 })   


 router.patch('/update/:id',async(req,res)=>{
     try{
     const user =  await User.findById(req.params.id)


     user.name=req.body.name
     user.email=req.body.email
     user.password=req.body.password
     user.phone=req.body.phone
     const u1= await user.save()

     res.json(u1)
     }
     catch(err){
        res.send("Enter correct details");
     }
 })

module.exports=router