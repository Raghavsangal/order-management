const express= require('express');
const router= express.Router();
const token_middleware = require('../services/jwt_verifier');
const representativeController = require('../controllers/representative.controller');

router.route('/login')
      .post(representativeController.login);

router.use(token_middleware);

router.route('/add-shopkeeper')
      .post(representativeController.addShopkeeper);

router.route('/products')
      .get(representativeController.getProducts);

router.route('/add-visit')
      .post(representativeController.visitLog);

router.route('/add-order/:id')
      .put(representativeController.addOrder);

module.exports = router;