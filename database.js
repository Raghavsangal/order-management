const mongoose=require('mongoose');
//IIFE
(function (){
    mongoose.connect('mongodb://localhost:27017/Final',{ useNewUrlParser: true,useUnifiedTopology: true } ,(err)=>{
        if(err){
            console.log('Error while connecting to database');
        }
        else{
            console.log('Successfully connected to database...');
        }
    })
}())