const ProductModel = require('../models/Product.model');
const RepresentativeModel = require('../models/Representative.model');
const OrderModel = require('../models/Order.model');
const ShopkeeperModel = require('../models/Shopkeeper.model');
const jwt = require('jsonwebtoken');

async function login(req, res) {
    const body = req.body;
    const Representative = await RepresentativeModel.findOne({ email: body.email, password: body.password });
    if (Representative != null) {
        var token = jwt.sign({ _id: Representative._id, email: Representative.email, user: 'representative' }, '123456');
        return res.status(200).json({ token });
    }
    else {
        return res.status(401).json({ message: 'Representative does not exist' });
    }
}

// A representative can add a shopkeeper to itself.
async function addShopkeeper(req, res) {
    if (req.user.user == 'representative') {
        const shopkeeper = new ShopkeeperModel(req.body);
        shopkeeper.representative_id = req.user._id;
        const doc = await shopkeeper.save();
        return res.status(200).json({ doc, message: "Shopkeeper Successfully Added.." });
    }
    else {
        return res.status(401).json({ message: "Only Admin and Representative can add shopkeeper. Sorry!" })
    }
}

// A representative can add his visits for a day.
async function visitLog(req, res) {
    try {
        if (req.user.user == 'representative') {
            const representative = await RepresentativeModel.findById(req.user._id);
            representative.visits.push({
                date: new Date(req.body.date).getDate(),
                location: req.body.location,
                remarks: req.body.remarks,
            });
            await representative.save();
            return res.status(200).json({ representative, message: "Vist log Successfully Added.." });
        }
        else {
            return res.status(401).json({ message: "Only Representative can add his visits. Sorry!" })
        }
    }
    catch (err) {
        console.log(err.message);
    }
}

// A representative can see all the products.
async function getProducts(req, res) {
    if (req.user.user == 'representative') {
        const result = await ProductModel.find();
        return res.status(200).json({ result, message: "All Products Present.." });
    }
    else {
        return res.status(401).json({ message: "Only Representative can see products. Sorry!" })
    }
}

// A representative can make an order for the shopkeeper that later has to be accepted by the shopkeeper.
async function addOrder(req, res) {
    if (req.user.user == 'representative') {
        const product_dealer_id = await ProductModel.findById(req.params.id);
        const order = new OrderModel(req.body);
        order.product_id = req.params.id;
        order.placed_by = req.user.user;
        order.approved_by_shopkeeper = false;
        order.approved_by_dealer = false;
        order.order_made_by = req.user.user;
        order.dealer_id = product_dealer_id.dealer_id;
        order.representative_id = req.user._id;

        const doc = await order.save();

        const representative_order = await RepresentativeModel.findById(req.user._id);
        await representative_order.order_id.push(doc._id);
        const result = representative_order.save();

        return res.status(200).json({ doc, message: "Order Successfully Placed.." })
    }
    else {
        return res.status(401).json({ message: 'Only Representative can order' });
    }
}

module.exports = {
    login,
    addShopkeeper,
    visitLog,
    addOrder,
    getProducts
}