const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var NewHallSchema = new Schema({
    HallName: { type: String, unique: true },
    Seats: Number,
    Location: String,
    Image: String
})
var NewHallData = mongoose.model('Hall', NewHallSchema);
module.exports = NewHallData;
