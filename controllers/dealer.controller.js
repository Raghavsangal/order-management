const ProductModel = require('../models/Product.model');
const DealerModel = require('../models/Dealer.model');
const OrderModel = require('../models/Order.model');
const jwt = require('jsonwebtoken');

async function signUp(req,res){
    const new_dealer= new DealerModel(req.body);
    const result = await new_dealer.save();
    return res.status(200).json({ result, message: "Dealer Added.." });
}

async function login(req, res) {
    const body = req.body;
    const dealer = await DealerModel.findOne({ email: body.email, password: body.password });
    if (dealer != null) {
        var token = jwt.sign({ _id: dealer._id, email: dealer.email, user: 'dealer' }, '123456');
        return res.status(200).json({ token });
    }
    else {
        return res.status(401).json({ message: 'Dealer does not exist' });
    }
}

// Dealer can add a new product for himself.
async function addProduct(req, res) {
    if(req.user.user=='dealer'){
    const new_product = new ProductModel(req.body);
    new_product.dealer_id=req.user._id;
    const doc=await new_product.save();

    const getDealer= await DealerModel.findById(req.user._id);
    await getDealer.products.push(doc._id);
    const result =  getDealer.save();

    return res.status(200).json({ result, message: "Product added to the dealer array.." });
    }
    else {
        return res.status(401).json({ message: "Only Dealer/Representative can see products. Sorry!" })
    }
}

// Dealer can see all the products he have.
async function getProducts(req, res) {
    if(req.user.user=='dealer'){
    const result = await ProductModel.find({dealer_id:req.user._id});
    return res.status(200).json({ result, message: "All Products Present.." });
    }
    else {
        return res.status(401).json({ message: "Only Dealer can see products. Sorry!" })
    }
}

// Dealer can make a bulk order to the company.
async function placeOrder(req, res) {
    if (req.user.user == 'dealer') {
        const new_order = new OrderModel(req.body);
        new_order.dealer_id = req.user._id;
        new_order.product_id = req.params.id;
        new_order.order_made_by = req.user.user;
        new_order.status = true;
        const doc = await new_order.save();
        return res.status(200).json({ doc, message: "Order Successfully Placed.." })
    }
    else {
        return res.status(401).json({ message: "Only Dealer can place order. Sorry!" })
    }
}

// Dealer can see all his bulk orders to the company.
async function myAllOrders(req,res){
    if (req.user.user=='dealer'){
        const orders = await OrderModel.find({dealer_id:req.user._id,order_made_by:'dealer'});
        return res.status(200).json({ orders, message: "All Orders.." })
    }
    else {
        return res.status(401).json({ message: "Only Dealer can access. Sorry!" })
    }
}

// Dealer can see his active orders to the company.
async function myActiveOrder(req, res) {
    if (req.user.user=='dealer'){
        const orders = await OrderModel.find({ status : true, dealer_id:req.user._id, order_made_by:'dealer'});
        return res.status(200).json({ orders, message: "All Active Orders.." })
    }
    else {
        return res.status(401).json({ message: "Only Dealer can access. Sorry!" })
    }
}

// Dealer can modify the status of a bulk order to the company.
async function modifyOrder(req, res) {
    if (req.user.user=='dealer'){
        const order = await OrderModel.findOne({ _id: req.params.id ,  dealer_id:req.user._id , order_made_by:'dealer'});
        const result = await order.update({ status: !order.status }, { new: true });
        return res.status(200).json({ order, message: "Order Updated Successfully.." })
    }
    else {
        return res.status(401).json({ message: "Only Dealer can access. Sorry!" })
    }
}

// Dealer can see the orders accepted by the shopkeeper for the product the dealer have.
async function shopOrders(req,res){
    if (req.user.user=='dealer'){
        const orders = await OrderModel.find({dealer_id:req.user._id,order_made_by:'representative',approved_by_shopkeeper:true});
        return res.status(200).json({ orders, message: "All Orders.." })
    }
    else {
        return res.status(401).json({ message: "Only Dealer can access. Sorry!" })
    }
}

// Dealer can approve the status of shopkeepers orders.
async function approveShopOrder(req,res){
    if (req.user.user=='dealer'){
        const orders = await OrderModel.findOne({_id:req.params.order_id,dealer_id:req.user._id,order_made_by:'representative',approved_by_shopkeeper:true});
        const result = await orders.update({ approved_by_dealer: !orders.status }, { new: true })
        return res.status(200).json({ orders, message: "Shop Order Approved.." })
    }
    else {
        return res.status(401).json({ message: "Only Dealer can access. Sorry!" })
    }
}

module.exports = {
    signUp,
    login,
    addProduct,
    getProducts,
    placeOrder,
    myActiveOrder,
    modifyOrder,
    myAllOrders,
    shopOrders,
    approveShopOrder
}