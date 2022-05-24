const express = require('express')

const router = express.Router()
const Movie= require('../models/movie')
const  jwt= require('jsonwebtoken')

function verifytoken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('unauthorized user')
    }
    let token=req.headers.authorization.split(' ')[1]
    if(token==='null'){
        return res.status(401).send('unauthorized user')
    }
    let payload = jwt.verify(token,'secretkey')
    if(!payload){
        return res.status(401).send('unauthorized user')
    }
    req.userId= payload.subject
    next()
}

function enhance(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('unauthorized user')
    }
    let token=req.headers.authorization.split(' ')[1]
    if(token==='null'){
        return res.status(401).send('unauthorized user')
    }
    let payload = jwt.verify(token,'secretkey')
    if(!payload || payload.role=='guest'){
        return res.status(401).send('unauthorized user')
    }
    req.userId= payload.subject
    next()
 }
router.get('/',async(req,res)=>{
    try{
       const movie = await Movie.find()
       res.status(200).json(movie)
    }
    catch(err){
        res.status(400).json({error:err})
    }
    
})
router.get('/list',verifytoken,async(req,res)=>{
    try{
       const movie = await Movie.find()
       list=[]
       for(let item of movie)
       {

          list.push(item.title)
       }
       res.status(200).json(list)
    }
    catch(err){
        res.status(400).json({error:err})
    }
    
})

router.get('/details/:id',verifytoken,async(req,res)=>{
    try{
       const movie = await Movie.findById(req.params.id)
       res.status(200).json(movie)
    }
    catch(err){
        res.status(400).json({error:err})
    }
    
})

router.post('/register',enhance,async(req,res)=>{
    const movie=new Movie(
    {
    title:req.body.title,
    language:req.body.language,
    genere:req.body.genere,
    director:req.body.director, 
    description:req.body.description, 
    duration:req.body.duration, 
    cast:req.body.cast, 
    releaseDate:req.body.releaseDate, 
    image:req.body.image 
   })
    try{
      const m1= await movie.save()
      res.status(200).json(m1)
    }catch(err)
    {
        res.status(400).json({error:err})
    }
    
    })

    router.patch('/update/:id',enhance,async(req,res)=>{
        try{
        const movie =  await Movie.findById(req.params.id)
        
        movie.title=req.body.title
        movie.language=req.body.language
        movie.genere=req.body.genere
        movie.director=req.body.director
        movie.cast=req.body.cast
        movie.description=req.body.description
        movie.duration=req.body.duration
        movie.releaseDate=req.body.releaseDate
        movie.image=req.body.image
        

        const u1= await movie.save()
        res.status(200).json(u1)
        }
        catch(err){
            res.status(400).json({error:err})
        }
    })















module.exports=router