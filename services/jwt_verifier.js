const jwt = require('jsonwebtoken');

function token_middleware_verifier(req,res,next){
    try{
        const auth=req.headers.authorization;
        if(!auth){
            return res.status(401).json({message:'Please login first'});
        }
        const token = auth.replace('Bearer ', '');
        const decode=jwt.verify(token,'123456');
        req.user=decode;
    }
    catch(e){
        console.log(e);
    }
    next();
}
module.exports=token_middleware_verifier;