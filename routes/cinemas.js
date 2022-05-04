const express = require('express')

const router = express.Router()

const Cinema= require('../models/cinema')
const Movie = require('../models/movie')

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
router.get('/list',async(req,res)=>{
    try{
        const city=req.params.city
       const cinema = await Cinema.find()
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
               startAt:item.startAt

           }
           theaters.push(theater)
          
       } 
       

       res.json(theaters)

    }
    catch(err){
        res.send('error' + err)
    }
})

router.get('/:id',async(req,res)=>{
    try{
       const cinema = await Cinema.findById(req.params.id)
       res.json(cinema)
    }
    catch(err){
        res.send('error' + err)
    }
    
})
router.post('/register/:id',async(req,res)=>{
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


    router.get('/search/:city',async(req,res)=>{
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
                moveId:movie.id,
                movieName:movie.title,
                city:item.city,
                startAt:item.startAt


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