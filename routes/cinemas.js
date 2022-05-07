const express = require('express')

const router = express.Router()
const  jwt= require('jsonwebtoken')
const Cinema= require('../models/cinema')
const Movie = require('../models/movie')
function verifytoken(req,res,next){
    if(!req.headers.authorization){
        return req.status(401).send('unauthorized user')
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


function compare( a, b ) {
    if ( a.seatsAvailability > b.seatsAvailability ){
      return -1;
    }
    if ( a.seatsAvailability < b.seatsAvailability ){
      return 1;
    }
    return 0;
  }

router.get('/',async(req,res)=>{
    try{
       const cinema = await Cinema.find()
       res.json(cinema)
    }
    catch(err){
        res.send('error' + err)
    }
    
})
router.get('/list',verifytoken,async(req,res)=>{
    try{
        let date=new Date().toISOString()
        date=date.substring(0,10)

        const city=req.params.city
       const cinema = await Cinema.find({date})
       cinema.sort(compare)
       let theaters=[]
       for(const item of cinema){
        const movie=await Movie.findById(item.movieId)
           let theater={
               theaterId:item.id,
               theaterName:item.name,
               seatsAvailability:item.seatsAvailability,
               movieId:movie.id,
               movieName:movie.title,
               city:item.city,
               startAt:item.startAt,
               image:movie.image,
               ticketPrice:item.ticketPrice,
               rows:item.rows,
               columns:item.columns

           }
           theaters.push(theater)
          
       } 
       

       res.json(theaters)

    }
    catch(err){
        res.send('error' + err)
    }
})

router.get('/:id',verifytoken,async(req,res)=>{
    try{
       const cinema = await Cinema.findById(req.params.id)
       res.json(cinema)
    }
    catch(err){
        res.send('error' + err)
    }
    
})
router.post('/register/:id',verifytoken,async(req,res)=>{
    const cinema=new Cinema(
    {
        name:req.body.name,
        ticketPrice:req.body.ticketPrice,
        city:req.body.city,
        seats:req.body.seats,
        seatsAvailability:req.body.seatsAvailability,
        movieId:req.params.id,
        startAt:req.body.startAt
    })
    try{
      const c1= await cinema.save()
      res.json(c1)
    }catch(err)
    {
        res.send("enter data corectly" + err);
    }
    
    })


    router.get('/search/:city',verifytoken,async(req,res)=>{

 
        try{
            const city=req.params.city
           const cinema = await Cinema.find({city})
           cinema.sort(compare)
           let theaters=[]
           for(const item of cinema){
            const movie=await Movie.findById(item.movieId)
               let theater={
                theaterId:item.id,
                theaterName:item.name,
                seatsAvailability:item.seatsAvailability,
                movieId:movie.id,
                movieName:movie.title,
                city:item.city,
                startAt:item.startAt,
                image:movie.image,
                ticketPrice:item.ticketPrice,
                rows:item.rows,
                columns:item.columns

               }
               theaters.push(theater)
              
           } 
           

           res.json(theaters)

        }
        catch(err){
            res.send('error' + err)
        }

        
    }) 


    router.get('/search/:city/:date',verifytoken,async(req,res)=>{

 
        try{
            const city=req.params.city
            const date=req.params.date
           const cinema = await Cinema.find({$and:[{'city':city},{'date':date}]})
           cinema.sort(compare)
           let theaters=[]
           for(const item of cinema){
            const movie=await Movie.findById(item.movieId)
               let theater={
                theaterId:item.id,
                theaterName:item.name,
                seatsAvailability:item.seatsAvailability,
                movieId:movie.id,
                movieName:movie.title,
                city:item.city,
                startAt:item.startAt,
                image:movie.image,
                ticketPrice:item.ticketPrice,
                rows:item.rows,
                columns:item.columns

               }
               theaters.push(theater)
              
           } 
           

           res.json(theaters)

        }
        catch(err){
            res.send('error' + err)
        }

        
    }) 


    router.get('/search//:date',verifytoken,async(req,res)=>{

 
        try{
            const city=req.params.city
            const date=req.params.date
           const cinema = await Cinema.find({'date':date})
           cinema.sort(compare)
           let theaters=[]
           for(const item of cinema){
            const movie=await Movie.findById(item.movieId)
               let theater={
                theaterId:item.id,
                theaterName:item.name,
                seatsAvailability:item.seatsAvailability,
                movieId:movie.id,
                movieName:movie.title,
                city:item.city,
                startAt:item.startAt,
                image:movie.image,
                ticketPrice:item.ticketPrice,
                rows:item.rows,
                columns:item.columns

               }
               theaters.push(theater)
              
           } 
           

           res.json(theaters)

        }
        catch(err){
            res.send('error' + err)
        }

        
    }) 









module.exports=router