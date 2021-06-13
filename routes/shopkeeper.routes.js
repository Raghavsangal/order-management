const express= require('express');
const router= express.Router();
const token_middleware = require('../services/jwt_verifier');
const shopkeeperController = require('../controllers/shopkeeper.controller');

router.route('/login')
      .post(shopkeeperController.login);

router.use(token_middleware);

router.route('/all-orders')
      .get(shopkeeperController.allOrders);

router.route('/approve-order/:order_id')
      .put(shopkeeperController.approveOrder);

router.route('/track-order/:order_id')
      .put(shopkeeperController.trackOrder);

module.exports= router;