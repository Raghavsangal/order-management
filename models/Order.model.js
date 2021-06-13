const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Dealers = require('./Dealer.model');
const Products = require('./Product.model');
const Representatives = require('./Representative.model');


const Order = new Schema({
    dealer_id:{ type: Schema.Types.ObjectId, ref: 'Dealers'},
    product_id:{type: Schema.Types.ObjectId, ref: 'Products'},
    order_made_by : {type:String},
    status:{type:Boolean},
    quantity:{type: Number},
    approved_by_dealer:{type: Boolean},
    approved_by_shopkeeper:{type:Boolean},
    representative_id:{type: Schema.Types.ObjectId, ref: 'Representatives'},
});

const Orders = mongoose.model('Orders',Order);
module.exports=Orders;