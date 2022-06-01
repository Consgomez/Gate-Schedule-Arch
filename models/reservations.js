let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const ReservationsSchema = Schema ({
    date: {
        type: String,
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
    aerolinea: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    reservation: {
        type: String,
        required: true
    }
    // user_id: {
    //     type: String,
    //     required: true
    // }
})

module.exports = mongoose.model('reservations', ReservationsSchema);