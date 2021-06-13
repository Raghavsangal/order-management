const express= require('express');
const router= express.Router();
const token_middleware = require('../services/jwt_verifier');
const dealerController = require('../controllers/dealer.controller');

router.route('/sign-up')
      .post(dealerController.signUp);

router.route('/login')
      .post(dealerController.login);

router.use(token_middleware);

router.route('/add-product')
      .post(dealerController.addProduct);

router.route('/products')
      .get(dealerController.getProducts);

router.route('/my-all-orders/')
      .get(dealerController.myAllOrders);

router.route('/place-order/:id')
      .put(dealerController.placeOrder);

router.route('/my-active-order/')
      .get(dealerController.myActiveOrder);

router.route('/modify-order/:id')
      .put(dealerController.modifyOrder);

router.route('/all-shopkeepers-order')
      .get(dealerController.shopOrders);

router.route('/approve-shopkeeper-order/:order_id')
      .put(dealerController.approveShopOrder);


module.exports= router;