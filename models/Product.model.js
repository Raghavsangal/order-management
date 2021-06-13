const mongoose=require('mongoose');
const Dealers = require('./Dealer.model');

const Schema = mongoose.Schema;

const Product = new Schema({
    name:{type:String, required: true},
    price:{type:Number, required: true},
    type:{type:String, required: true},
    dealer_id:{type: Schema.Types.ObjectId, ref: 'Dealers'}
});

const Products = mongoose.model('Products',Product);
module.exports = Products;