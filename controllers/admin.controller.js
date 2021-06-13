const ProductModel = require('../models/Product.model');
const DealerModel = require('../models/Dealer.model');
const ShopkeeperModel = require('../models/Shopkeeper.model');
const RepresentativeModel = require('../models/Representative.model');
const AdminModel = require('../models/Admin.model');
const OrderModel = require('../models/Order.model');
const jwt = require('jsonwebtoken');


async function signUp(req, res) {
    const new_admin = new AdminModel(req.body);
    const result = await new_admin.save();
    return res.status(200).json({ result, message: "Admin Added.." });
}

async function login(req, res) {
    const body = req.body;
    const admin = await AdminModel.findOne({ email: body.email, password: body.password });
    if (admin != null) {
        var token = jwt.sign({ _id: admin._id, email: admin.email, user: 'admin' }, '123456');
        return res.status(200).json({ token });
    }
    else {
        return res.status(401).json({ message: 'Admin does not exist' });
    }
}

// Admin can add dealer
async function addDealer(req, res) {
    if (req.user.user == 'admin') {
        const dealer = new DealerModel(req.body);
        const doc = await dealer.save();
        return res.status(200).json({ doc, message: "Dealer Successfully Added.." });
    }
    else {
        return res.status(401).json({ message: "Only Admin can add Dealers. Sorry!" });
    }
}

//Admin can add Shopkeeper
async function addShopkeeper(req, res) {
    if (req.user.user == 'admin') {
        const shopkeeper = new ShopkeeperModel(req.body);
        shopkeeper.representative_id = req.params.representative_id;
        const doc = await shopkeeper.save();

        const rep_assign = await RepresentativeModel.findById(req.params.representative_id);
        await rep_assign.update({ shop_id: doc._id }, { new: true });

        return res.status(200).json({ doc, message: "Shopkeeper Successfully Added.." });
    }
    else {
        return res.status(401).json({ message: "Only Admin can add Shopkeepers. Sorry!" });
    }
}

// Admin can see all the dealers
async function showDealers(req, res) {
    if (req.user.user == 'admin') {
        const result = await DealerModel.find();
        if (result != null) {
            return res.status(200).json({ result, message: "All Dealers Present.." });
        }
        else {
            return res.status(200).json({ message: "No Dealers.." });
        }
    }
    else {
        return res.status(401).json({ message: "Only Admin can see all Dealers. Sorry!" });
    }
}

//Admin can see all the shops.
async function showShops(req, res) {
    if (req.user.user == 'admin') {
        const result = await ShopkeeperModel.find();
        if (result != null) {
            return res.status(200).json({ result, message: "All Shops Present.." });
        }
        else {
            return res.status(200).json({ message: "No Shops.." });
        }
    }
    else {
        return res.status(401).json({ message: "Only Admin can see all Shopkeepers. Sorry!" });
    }
}

// Admin can see All the Representatives.
async function showRepresentatives(req, res) {
    if (req.user.user == 'admin') {
        const result = await RepresentativeModel.find();
        if (result != null) {
            return res.status(200).json({ result, message: "All Representatives Present.." });
        }
        else {
            return res.status(200).json({ message: "No Representatives.." });
        }
    }
    else {
        return res.status(401).json({ message: "Only Admin can see all Representatives. Sorry!" });
    }
}

//Admin can Add Representative.
async function addRepresentative(req, res) {
    if (req.user.user == 'admin') {
        const representative = new RepresentativeModel(req.body);
        const doc = await representative.save();
        return res.status(200).json({ doc, message: "Representative Successfully Added.." });
    }
    else {
        return res.status(401).json({ message: "Only Admin can add Representatives. Sorry!" });
    }
}

//Admin can add a new product for a dealer.
async function addProduct(req, res) {
    if (req.user.user == 'admin') {
        const product = new ProductModel(req.body);
        product.dealer_id = req.params.dealer_id;
        const doc = await product.save();

        const getDealer = await DealerModel.findById(req.params.dealer_id);
        await getDealer.products.push(doc._id);
        const result = getDealer.save();

        return res.status(200).json({ doc, message: "Product Successfully Added.." });
    }
    else {
        return res.status(401).json({ message: "Only Admin can add Products. Sorry!" });
    }
}

// Admin can see all the orders made by the dealer to the company.
async function allOrders(req,res){
    if (req.user.user=='admin'){
        const orders = await OrderModel.find({order_made_by:'dealer'});
        return res.status(200).json({ orders, message: "All Orders.." })
    }
    else {
        return res.status(401).json({ message: "Only Admin can access. Sorry!" });
    }
}

// Admin can see modify the orders made by the dealer to the company.
async function modifyOrder(req, res) {
    if (req.user.user=='admin'){
        const order = await OrderModel.findOne({ _id: req.params.order_id , order_made_by:'dealer'});
        const result = await order.update({ status: !order.status }, { new: true });
        return res.status(200).json({ order, message: "Order Updated Successfully.." });
    }
    else {
        return res.status(401).json({ message: "Only Admin can access. Sorry!" });
    }
}

// Admin can see all the orders made by the representatives for the shopkeeper.
async function repOrders(req, res) {
    if (req.user.user=='admin'){
        const order = await OrderModel.find({order_made_by:'representative'});
        return res.status(200).json({ order, message: "Orders by represenatives.." });
    }
    else {
        return res.status(401).json({ message: "Only Admin can access. Sorry!" });
    }
}

module.exports = {
    signUp,
    login,
    addDealer,
    addShopkeeper,
    addProduct,
    addRepresentative,
    showDealers,
    showRepresentatives,
    showShops,
    allOrders,
    modifyOrder,
    repOrders
}