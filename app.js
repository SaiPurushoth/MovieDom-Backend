const express = require('express')
var bodyParser = require('body-parser')
const mongoose = require('mongoose')

const  jwt= require('jsonwebtoken')
const url ='mongodb://localhost/Moviedom'
mongoose.connect(url)
const con = mongoose.connection

const app=express()
app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json()) 

const cor = require('cors')
app.use(cor())

const customerRouters = require('./routes/customers') 
app.use('/users',customerRouters)

const movieRouters = require('./routes/movies')
app.use('/movies',movieRouters)

const cinemaRouters = require('./routes/cinemas')
app.use('/cinemas',cinemaRouters)


const reservationRouters =  require('./routes/reservations')
app.use('/reservations',reservationRouters)




con.on('open',()=>{
    console.log('connected')
})
app.listen(9000,()=>{
    console.log('server started')
})