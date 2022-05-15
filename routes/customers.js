const express = require('express')

const router = express.Router()

const User= require('../models/customer')
const  jwt= require('jsonwebtoken')

const nodemailer = require('nodemailer');


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
       const transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
             user: "moviedom123@gmail.com",
             pass: "movie-dom@1234"
         }
      });
const mailConfigurations = {
  
    from: 'moviedom123@gmail.com',
  
    to: email,
  
    subject: 'Email Verification',
      
    text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           http://localhost:9000/users/verify/${token}/${id} 
           Thanks`
      
};
var obj
transporter.sendMail(mailConfigurations, function(error, info){
   if (error){
      console.log(error)
   };
   console.log('Email Sent Successfully');
   obj={
      information:info
   }
});

       res.json({obj})
    }catch(err)
    {
        res.send("already a user" + err);
    }
    
    })

router.get('/verify/:token/:id',async(req,res)=>{
  const token=req.params.token
  const userid=req.params.id
  const user= await User.findById(userid)
  jwt.verify(token, 'secretkey', async(err, decoded)=>{
   if (err) {
      console.log(err);
      res.send("Email verification failed,possibly the link is invalid or expired");
      throw new Error(err);

   }
   else {
      user.isVerified=true
      const u1 = await user.save()
       res.send("Email verifified successfully");
   }
});


})

 router.post('/login',async(req,res)=>{
  try{
    const user = await User.findByCredentials(req.body.email,req.body.password);
    const email=req.body.email
    let us=await User.find({email})
  
    let id
    let role
    let verified
    for(let item of us)
    {
         id=item._id ,
         role=item.role,
         verified=item.isVerified
    }
   if(verified==false)
   {
      res.send("error")
   }

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