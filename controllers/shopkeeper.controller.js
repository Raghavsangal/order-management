const ShopkeeperModel = require('../models/Shopkeeper.model');
const Orders = require('../models/Order.model');
const jwt = require('jsonwebtoken');

async function login(req, res) {
    const body = req.body;
    const shopkeeper = await ShopkeeperModel.findOne({ email: body.email, password: body.password });
    if (shopkeeper != null) {
        var token = jwt.sign({ _id: shopkeeper._id, email: shopkeeper.email, user: 'shopkeeper' }, '123456');
        return res.status(200).json({ token });
    }
    else {
        return res.status(401).json({ message: 'Shopkeeper does not exist' });
    }
}

// A shopkeeper can see all the orders made by the representative on the behalf of it.
async function allOrders(req,res){
    if(req.user.user=='shopkeeper'){
    const shopkeeper= await ShopkeeperModel.findById(req.user._id);
    const myRep= shopkeeper.representative_id;
    const orders = await Orders.find({representative_id:myRep});
    return res.status(200).json({ orders, message: "All Orders Present.." });
    }
    else {
        return res.status(401).json({ message: "Only Shopkeepers can see his orders. Sorry!" })
    }
}

// A shopkeeper can approve the order made by the representative on the behalf of it.
async function approveOrder(req,res){
    if(req.user.user=='shopkeeper'){
        const shopkeeper= await ShopkeeperModel.findById(req.user._id);
        const myRep= shopkeeper.representative_id;
        const orders = await Orders.findOne({_id:req.params.order_id,representative_id:myRep,approved_by_shopkeeper:false});
        const result= await orders.update({approved_by_shopkeeper:true},{ new: true });
        return res.status(200).json({ orders, message: "Order Approved.." });
        }
        else {
            return res.status(401).json({ message: "Only Shopkeepers can approve orders. Sorry!" })
        }
}

// A shopkeeper can track the order made by the representative on the behalf of it.(Like whether Dealer accepted it or not.)
async function trackOrder(req,res){
    if(req.user.user=='shopkeeper'){
        const shopkeeper= await ShopkeeperModel.findById(req.user._id);
        const myRep= shopkeeper.representative_id;
        const orders = await Orders.find({_id:req.params.order_id,representative_id:myRep,approved_by_shopkeeper:true});
        return res.status(200).json({ orders, message: "Order Track.." });
        }
        else {
            return res.status(401).json({ message: "Only Shopkeepers can track their orders. Sorry!" })
        }
}

module.exports = {
    login,
    allOrders,
    approveOrder,
    trackOrder
}