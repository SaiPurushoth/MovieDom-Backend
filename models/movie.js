const mongoose = require('mongoose')


const movieSchema = new mongoose.Schema({

title:{
    type: String,
    required:true
},

language:{
    type: String,
    required: true
},
genere:{
    type: String,
    required:true
},
director:{
     type:String,
     required:true
},
cast:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
duration:{
    type: Number,
    required:true
},
releaseDate: {
    type: Date,
    required: true,
  },
  image:{
      type:String,
  }
})

const Movie = mongoose.model('Movie',movieSchema)
module.exports = Movie