const jwt = require("jsonwebtoken");

module.exports =  function (req, res, next){
    const token = req.header('authorization');

    if(!token) return res.status(401).json({"msg": "Access Denied"});

    // verify token
    try{
        let bearerHeader = req.headers.authorization;
        if(typeof bearerHeader  !== "undefined"){
            let bearer = bearerHeader.split(" ");
            if(bearer.length > 1){
                bearerHeader = bearer[1];
            }
        }
        const verified = jwt.verify(bearerHeader, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err){
        res.status(401).json({"msg": "Access Denied"});
    }
}