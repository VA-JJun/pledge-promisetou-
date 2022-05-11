const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
    title: {type: String, required: true},
    address: {type: String, required: true},
    lat: {type: Number, required: true},
    lng: {type: Number, required: true},
    policyname: {type: String, required: false},
    votetitle: {type: String, required: false},
    name: {type: String, required: false},
    party: {type: String, required: false},
    content: {type: String, required: false},
    contact: {type: String, required: false},
    
});
module.exports = mongoose.model("location",locationSchema);
