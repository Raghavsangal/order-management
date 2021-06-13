const express= require('express');
const router= express.Router();
const adminController = require('../controllers/admin.controller');
const token_middleware = require('../services/jwt_verifier');

router.route('/sign-up')
      .post(adminController.signUp);

router.route('/login')
      .post(adminController.login);

router.use(token_middleware);

router.route('/show-dealers')
      .get(adminController.showDealers);

router.route('/show-shops')
      .get(adminController.showShops);

router.route('/show-representatives')
      .get(adminController.showRepresentatives);

router.route('/add-Dealer')
      .post(adminController.addDealer);

router.route('/add-Representative')
      .post(adminController.addRepresentative);

router.route('/add-Shopkeeper/:representative_id')
      .put(adminController.addShopkeeper);

router.route('/add-Product/:dealer_id')
      .put(adminController.addProduct);

router.route('/view-dealer-orders')
      .get(adminController.allOrders);

router.route('/modify-dealer-order/:order_id')
      .put(adminController.modifyOrder);

router.route('/view-representative-orders')
      .get(adminController.repOrders);

module.exports= router;