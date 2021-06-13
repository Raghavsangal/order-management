const mongoose=require('mongoose');
const Products=require('./Product.model');

const Schema= mongoose.Schema;
const Dealer=new Schema({
    name:{type:String, required: true},
    email: {type: String , required: true},
    password: {type: String,  required: true},
    phone:{type:Number},
    state:{type:String},
    products:[{type: Schema.Types.ObjectId, ref: 'Products'}]
});
const Dealers=mongoose.model('Dealers',Dealer);
module.exports=Dealers;