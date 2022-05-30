let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const ReservationsSchema = Schema ({
    date: {
        type: Date,
        required: true
    },
    gate: {
        type: Number,
        required: true
    },
    hour: {
        type: String,
        required: true
    },
    reservation: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('reservations', ReservationsSchema);