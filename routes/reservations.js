
const express = require('express')
const Cinema = require('../models/cinema')
const User = require('../models/customer')
const Movie = require('../models/movie')

const router = express.Router()

const Reservation= require('../models/reservation')


router.get('/',async(req,res)=>{
    try{
       const reserve = await Reservation.find()
       res.json(reserve)
    }
    catch(err){
        res.send('error' + err)
    }
    
})

router.get('/details/:userId',async(req,res)=>{
    try{
       const reserve = await Reservation.find({'userId':req.params.userId})
       let list=[]
       for(let item of reserve)
       {
       const movie= await Movie.findById(item.movieId)
       const cinema=await Cinema.findById(item.cinemaId)
      var obj={
          date:item.date,
          total:item.total,
          seats:item.seats,
          movieName:movie.title,
          cinemaName:cinema.name
      }
     list.push(obj)
    }
      res.send(list)
    }
    catch(err){
        res.send('error' + err)
    }
    
})
router.post('/book/:theaterId/:movieId/:userId/:startTime',async(req,res)=>{
    const cinemas= await Cinema.find({$and:[{'_id':req.params.theaterId},{movieId:req.params.movieId},{'startAt':req.params.startTime}]})
     let ticketPrice
     const userId=req.params.userId
     const movieId=req.params.movieId
     const cinemaId=req.params.theaterId
     const startAt=req.params.startTime
     for(const item of cinemas){
        ticketPrice=item.ticketPrice
     }
    const seats=req.body.seats
    const total=seats*ticketPrice
    const reserve=new Reservation (
    {
        date:req.body.date,
        ticketPrice:ticketPrice,
        seats:seats,
        total:total,
        movieId:req.params.movieId,
        cinemaId:req.params.theaterId,
        userId:req.params.userId
    })
    try{
    const r1= await reserve.save()
        for(const item of cinemas){
            if(item.seatsAvailability>seats)
            {
            item.seatsAvailability=item.seatsAvailability-seats;
            const r2=await item.save()
            }
            else{
                res.send("Booking over"); 
            }
        }   

    const user= await User.findById(userId)
    const movie= await Movie.findById(movieId)
    const cinema=await Cinema.findById(cinemaId)

      var obj={
          date:req.body.date,
          email:user.email,
          phone:user.phone,
          theaterName:cinema.name,
          movieName:movie.title,
          ticketPrice:ticketPrice,
          startAt:startAt,
          seats:seats,
          total:total,

      }

      res.json(obj)
    }catch(err)
    {
        res.send("enter data corectly" + err);
    }
    
    })

    module.exports=router