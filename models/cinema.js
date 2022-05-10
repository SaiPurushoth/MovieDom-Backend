const mongoose = require('mongoose')
const { search } = require('../routes/customers')

const {Schema} = mongoose
const cinemaSchema = new mongoose.Schema({
date:{
    type:String,
    required:true
},
name:{
    type: String,
    required:true
},
startAt: {
    type: String,
    required: true,
  },

ticketPrice:{
    type: Number,
    required: true
},
city:{
     type:String,
     required:true,
     lowercase:true
},
seats:{
    type:[Schema.Types.Mixed],
    required:true
},
rows:{
    type:[Schema.Types.Mixed],
    required:true
},
columns:{
    type:[Schema.Types.Mixed],
    required:true
},
seatsAvailability:{
    type:Number,
    required:true
},
movieId:{
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required:true
},
  image:{
      type:String,
  }
})

const Cinema = mongoose.model('Cinema',cinemaSchema)
module.exports=Cinema