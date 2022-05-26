
const express = require('express')
const Cinema = require('../models/cinema')
const User = require('../models/customer')
const Movie = require('../models/movie')
const  jwt= require('jsonwebtoken')
const router = express.Router()

const Reservation= require('../models/reservation')
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
       const reserve = await Reservation.find()
       res.status(200).json(reserve)
    }
    catch(err){
        res.status(400).json({error:err})
    }
    
})

router.delete('/delete/:id',verifytoken,async(req,res)=>{
    try{
        const r1=await Reservation.findById(req.params.id)
        date=r1.date.toISOString().substring(0,10)
        const c1=await Cinema.find({$and:[{'cinemaId':r1.cinemaId},{'date':date}]})
        for(let item of c1)
        {
        item.seatsAvailability=item.seatsAvailability+r1.seats.length
        const c2 = await item.save()
        }
       const reserve = await Reservation.findByIdAndDelete(req.params.id)
       res.status(200).json(reserve)
    }
    catch(err){
        res.status(400).json({error:err})
    }
    
})
router.get('/list',enhance,async(req,res)=>{
    try{
       const reserve = await Reservation.find()
       list=[]
        for(let item of reserve)
        {
        const movie=await Movie.findById(item.movieId)
        const cinema=await Cinema.findById(item.cinemaId)
        const user=await User.findById(item.userId)
          var obj={
              date:item.date,
              seats:item.seats,
              ticketPrice:item.ticketPrice,
              total:item.total,
              moviename:movie.title,
              cinemaname:cinema.name,
              username:user.name
          }
          list.push(obj)
        }

       res.status(200).json(list)
    }
    catch(err){
        res.status(400).json({error:err})
    }
    
})
router.get('/details/:userId',verifytoken,async(req,res)=>{
    try{
       const reserve = await Reservation.find({'userId':req.params.userId})
       let list=[]
       for(let item of reserve)
       {
       const movie= await Movie.findById(item.movieId)
       const cinema=await Cinema.findById(item.cinemaId)
      var obj={
          id:item._id,
          date:item.date,
          total:item.total,
          seats:item.seats,
          movieName:movie.title,
          cinemaName:cinema.name,
          startAt:cinema.startAt
      }
     list.push(obj)
    }
      res.status(200).json(list)
    }
    catch(err){
        res.status(400).json({error:err})
    }
    
})
router.post('/book/:theaterId/:userId',verifytoken,async(req,res)=>{
    const cinemas= await Cinema.find({'_id':req.params.theaterId})

     let ticketPrice
     const userId=req.params.userId
     let movieId
     const cinemaId=req.params.theaterId
     let startAt
     for(const item of cinemas){
        ticketPrice=item.ticketPrice
        movieId=item.movieId
        startAt=item.startAt
     }
    const seats=req.body.seats
    const total=seats.length*ticketPrice
    const reserve=new Reservation (
    {
        date:req.body.date,
        ticketPrice:ticketPrice,
        seats:seats,
        total:total,
        movieId:movieId,
        cinemaId:req.params.theaterId,
        userId:req.params.userId
    })
    try{
    const r1= await reserve.save()
        for(const item of cinemas){
            if(item.seatsAvailability>seats.length)
            {
            item.seatsAvailability=item.seatsAvailability-seats.length;
            const r2=await item.save()
            }
            else{
                res.status(400).json({error:"booking over"})
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

      res.status(200).json(obj)
    }catch(err)
    {
        res.status(400).json({error:err})
    }
    
    })


    router.get('/booked/:theaterId/:date',verifytoken,async(req,res)=>{
        try{
           const reserve = await Reservation.find({$and:[{'cinemaId':req.params.theaterId},{'date':req.params.date}]})
           let list=[]
           for(let item of reserve)
           {
            for(let chair of item.seats )
            {
                list.push(chair)
            }
 
        }
          res.status(200).json(list)
        }
        catch(err){
            res.status(400).json({error:err})
        }
        
    })


    module.exports=router