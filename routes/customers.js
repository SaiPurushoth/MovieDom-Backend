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

router.get('/makeAdmin/:id',async(req,res)=>{
   try{
      const user = await User.findById(req.params.id)
      user.role='admin'
      const u1 = await user.save()
      res.json(u1)
   }
   catch(err){
       res.send('error' + err)
   }
   
})
router.get('/one/:id',async(req,res)=>{
   try{
      const user = await User.findById(req.params.id)
      res.json(user)
   }
   catch(err){
       res.send('error' + err)
   }
   
})
router.get('/list',async(req,res)=>{
   try{
      const user = await User.find({'role':'guest'})
      list=[]
      for(let item of user)
      {
         let obj={
            id:item._id,
            name:item.name,
            email:item.email,
            phone:item.phone
         }
         list.push(obj)
      }
      res.json(list)
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
       const u1=await user.save()
      const us=await User.find({email})
      let id
      let role
      let payload={
        subject:us._id
       }
       let token=jwt.sign(payload,'secretkey',{expiresIn:'1h'})
       for(let item of us)
       {
            id=item._id 
            role=item.role
       }
       var obj={
          id:id,
          role:role,
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
    let role
    let payload={
     subject:us._id
    }
    let token=jwt.sign(payload,'secretkey',{expiresIn:'1h'})

    for(let item of us)
    {
         id=item._id ,
         role=item.role
    }
    var obj={
       id:id,
       role:role,
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