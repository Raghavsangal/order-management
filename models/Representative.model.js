const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const Shopkeepers = require('./Shopkeeper.model');
const Orders = require('./Order.model');

const Visits = new Schema({
    date:{type:Date},
    location:{type:String},
    remarks:{type:String}
});
const Representative = new Schema({
    name:{type:String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phone:{type:Number},
    visits:[{type:Visits}],
    shop_id:{type: Schema.Types.ObjectId, ref: 'Shopkeepers'},
    order_id:[{type: Schema.Types.ObjectId, ref: 'Orders'}]
});
const Representatives = mongoose.model('Representatives',Representative);
module.exports = Representatives;