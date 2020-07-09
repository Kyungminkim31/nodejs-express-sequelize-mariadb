var jwt = require("jsonwebtoken");
var config = require("../config/auth.config");

function verifyToken(req, res, next){
  var token = req.headers["x-access-token"];
  console.log("verifyToken");
  if(!token){
    return res.status(403).send({auth: false, message:"No token provided."});
  }

  jwt.verify(token, config.secret, (err, decoded)=>{
    if(err){
      return res.status(500).send({ auth: false, message: "Falied to authenticate token."});
    }

    req.userId = decoded.id;
    next();
  });
}

module.exports = verifyToken;