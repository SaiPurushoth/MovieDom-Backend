const express = require('express')

const router = express.Router()
const  jwt= require('jsonwebtoken')
const Cinema= require('../models/cinema')
const Movie = require('../models/movie')
const Reservation = require('../models/reservation')
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
       res.status(200).json(cinema)
    }
    catch(err){
        res.status(400).json({error:err})
    }
    
})

router.get('/all',async(req,res)=>{
    try{
       const cinema = await Cinema.find()
       list=[]
       for(let item of cinema){
           const movie=await Movie.findById(item.movieId)
    var obj={
      id:item._id,
      name:item.name,
      city:item.city,
    startAt:item.startAt,
    ticketPrice:item.ticketPrice,
    seats:item.seats,
    movieName:movie.title,
    image:item.image,
    rows:item.rows,
    columns:item.columns,
    date:item.date
    }
    list.push(obj)
       }

       res.status(200).json(list)
    }
    catch(err){
        res.status(400).json({error:err})
    }
    
})

router.get('/delete/:id',async(req,res)=>{
    try{
        const c1 = await Cinema.findById(req.params.id)
       const cinema = await Cinema.findByIdAndDelete(req.params.id)
       const reserve = await Reservation.find({'cinemaId':c1._id})
       for(let item of reserve)
       {
           const rs= await Reservation.findByIdAndDelete(item._id)
       }
       res.status(200).json(cinema)
    }
    catch(err){
        res.status(400).json({error:err})
    }
    
})


router.get('/list/:movieId',verifytoken,async(req,res)=>{
    try{
        const movieId=req.params.movieId
        let date=new Date().toISOString()
        date=date.substring(0,10)

       const cinema = await Cinema.find({$and:[{'movieId':movieId},{'date':date}]})
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
               image:item.image,
               ticketPrice:item.ticketPrice,
               rows:item.rows,
               columns:item.columns

           }
           theaters.push(theater)
          
       } 
       

       res.status(200).json(theaters)

    }
    catch(err){
        res.status(400).json({error:err})
    }
})

router.get('/:id',verifytoken,async(req,res)=>{
    try{
       const cinema = await Cinema.findById(req.params.id)
       res.status(200).json(cinema)
    }
    catch(err){
        res.status(400).json({error:err})
    }
    
})

router.patch('/update/:id',async(req,res)=>{
    try{
    const cinema =  await Cinema.findById(req.params.id)
    let title=req.body.movie
    const item=await Movie.findOne({title})
    let rows=req.body.rows
    rows=rows.replace(/\[|\]/g,'').split(',')
    let columns=req.body.columns
    columns=columns.replace(/\[|\]/g,'').split(',')
    const seats=rows.length * columns.length
    cinema.name=req.body.name,
    cinema.city=req.body.city,
    cinema.ticketPrice=req.body.ticketPrice,
    cinema.rows=rows,
    cinema.columns=columns,
    cinema.movie=req.body.movie,
    cinema.startAt=req.body.startAt,
    cinema.date=req.body.date,
    cinema.image=req.body.image
    cinema.seats=seats
    const c1= await cinema.save()

    res.status(200).json(c1)
    }
    catch(err){
        res.status(400).json({error:err})
    }
})
router.post('/register',verifytoken,async(req,res)=>{
    let title=req.body.movie
    const item=await Movie.findOne({title})
    let rows=req.body.rows
    rows=rows.replace(/\[|\]/g,'').split(',')
    let columns=req.body.columns
    columns=columns.replace(/\[|\]/g,'').split(',')
    const seats=rows.length * columns.length

    const cinema=new Cinema(
    {
        name:req.body.name,
        ticketPrice:req.body.ticketPrice,
        city:req.body.city,
        seats:seats,
        seatsAvailability:seats,
        movieId:item.id,
        startAt:req.body.startAt,
        date:req.body.date,
        rows:rows,
        columns:columns,
        image:req.body.image
    })
    try{
      const c1= await cinema.save()
      res.status(200).json(c1)
    }catch(err)
    {
        res.status(400).json({error:err})
    }
    
    })


    router.get('/search/:movieId/:city',verifytoken,async(req,res)=>{

 
        try{
            const movieId=req.params.movieId
            let date=new Date().toISOString()
            date=date.substring(0,10)
            const city=req.params.city
           const cinema = await Cinema.find({$and:[{'city':city},{'date':date},{'movieId':movieId}]})
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
                image:item.image,
                ticketPrice:item.ticketPrice,
                rows:item.rows,
                columns:item.columns

               }
               theaters.push(theater)
              
           } 
           

           res.status(200).json(theaters)

        }
        catch(err){
            res.status(400).json({error:err})
        }

        
    }) 


    router.get('/search/:movieId/:city/:date',verifytoken,async(req,res)=>{

 
        try{
            const movieId=req.params.movieId
            const city=req.params.city
            const date=req.params.date
           const cinema = await Cinema.find({$and:[{'city':city},{'date':date},{'movieId':movieId}]})
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
                image:item.image,
                ticketPrice:item.ticketPrice,
                rows:item.rows,
                columns:item.columns

               }
               theaters.push(theater)
              
           } 
           

           res.status(200).json(theaters)

        }
        catch(err){
            res.status(400).json({error:err})
        }

        
    }) 


    router.get('/search/:movieId//:date',verifytoken,async(req,res)=>{

 
        try{
            const movieId=req.params.movieId
            const city=req.params.city
            const date=req.params.date
           const cinema = await Cinema.find({$and:[{'movieId':movieId},{'date':date}]})
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
                image:item.image,
                ticketPrice:item.ticketPrice,
                rows:item.rows,
                columns:item.columns

               }
               theaters.push(theater)
              
           } 
           

           res.status(200).json(theaters)

        }
        catch(err){
            res.status(400).json({error:err})
        }

        
    }) 









module.exports=router