const mongoose = require('mongoose')

const {Schema} = mongoose

const reservationSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
      },

      seats: {
        type: [Schema.Types.Mixed],
        required: true,
      },
      ticketPrice: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      movieId: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
      },
      cinemaId: {
        type: Schema.Types.ObjectId,
        ref: 'Cinema',
        required: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },


})

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;