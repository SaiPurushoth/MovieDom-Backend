const express = require('express')

const router = express.Router()
const Movie= require('../models/movie')

router.get('/',async(req,res)=>{
    try{
       const movie = await Movie.find()
       res.json(movie)
    }
    catch(err){
        res.send('error' + err)
    }
    
})

router.get('/details/:id',async(req,res)=>{
    try{
       const movie = await Movie.findById(req.params.id)
       res.json(movie)
    }
    catch(err){
        res.send('error' + err)
    }
    
})

router.post('/register',async(req,res)=>{
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
    })
    try{
      const m1= await movie.save()
      res.json(m1)
    }catch(err)
    {
        res.send("enter data coorectly" + err);
    }
    
    })

    router.patch('/update/:id',async(req,res)=>{
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
        

        const u1= await movie.save()
        res.json(u1)
        }
        catch(err){
           res.send("Enter correct details");
        }
    })















module.exports=router