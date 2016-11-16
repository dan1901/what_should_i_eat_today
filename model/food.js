/**
 * Created by K on 2016. 3. 14..
 */
var mongoose = require('mongoose');

var food_model = new mongoose.Schema({
    meat: Boolean,
    spicy: Boolean,
    soup: Boolean,
    name: String
});

module.exports = {
    food: mongoose.model('food', food_model)
};