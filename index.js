const express= require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const AdminRoutes= require('./routes/admin.routes');
const DealerRoutes= require('./routes/dealer.routes');
const ShopkeeperRoutes= require('./routes/shopkeeper.routes');
const RepresentativeRoutes = require('./routes/representative.routes');

// require('dotenv').config();
require('./database');


const app=express();
app.use(bodyParser.json());

app.use('/admin',AdminRoutes);
app.use('/dealer',DealerRoutes);
app.use('/shopkeeper',ShopkeeperRoutes);
app.use('/representative',RepresentativeRoutes)
app.listen(3000,()=>console.log('Server started at 3000 port'));