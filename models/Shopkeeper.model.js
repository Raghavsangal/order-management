const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const Representatives = require('./Representative.model');


const Shopkeeper = new Schema({
    name:{type:String, required: true},
    shop_name:{type:String, required: true},
    email: {type: String , required: true},
    password: {type: String, required: true},
    phone:{type:Number},
    district:{type:String},
    representative_id:{type: Schema.Types.ObjectId, ref: 'Representatives'}
});

const Shopkeepers = mongoose.model('Shopkeepers',Shopkeeper);
module.exports = Shopkeepers;