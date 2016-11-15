/**
 * Created by K on 2016. 3. 14..
 */
var mongoose = require('mongoose');

var furniture_model = new mongoose.Schema({
    category: String,
    name: String,
    width:Number,
    height_length: Number,
    height:Number,
    price: Number,
    image:String,
    url:String
});

module.exports={
    furniture:mongoose.model('furniture',furniture_model)
};