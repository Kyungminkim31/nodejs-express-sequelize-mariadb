'use strict';

const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

var jwt=require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var config = require("../config/auth.config");

exports.logout = (req, res) => {
  res.status(200).send({auth: false, token:null });
};

exports.login = (req, res) => {
  User.findOne(
    { where: 
      {
        email : req.body.email
      }
  }).then(user => {
    if(!user)
      return res.status(401).send({auth: false, token: null});

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if(!passwordIsValid)
      return res.status(401).send({auth: false, token: null});

    var token = jwt.sign(
      {id: user.id},
      config.secret,
      {expiresIn: 86400});

    return res.status(200).send({
      username: user.name,
      email: user.email,
      password: user.password,
      token:token
    });
  }).catch(err => {
    console.log(err);
    return res.status(500).send({
      "success": 0,
      "messeage": "error!!! - /api/auth/login"
    });
  });

};

exports.register = (req, res) => {

  if(!req.body.email) {
    return res.status(400).send({
      message: "email can not be empty!"
    });
    
  }

  if(!req.body.password){
    return res.status(400).send({
      message: "password can not be empty!"
    });
  }

  if(!req.body.name){
    return res.status(400).send({
      message: "name can not be empty!"
    });
  }

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  const user = {
    name: req.body.name,
    password: hashedPassword,
    email: req.body.email
  };

  User.create(user)
  .then(data=>{
    var token = jwt.sign(
      { id:data.id},
      config.secret, 
      {expiresIn:86400}
    );
    res.status(200).send({auth:true, token: token});
  })
  .catch(err=>{
    res.status(500).send({
      message:
        err.message || "사용자 등록 중 오류가 발생하였습니다."
    });
  });
}

exports.authToken = (req, res) => {
  var token = req.headers['x-access-token'];

  if(!token) 
    return res.status(401).send({ auth:false, message: '제공된 토큰이 존재하지 않습니다.'});

  jwt.verify(
    token, 
    config.secret,
    (err, decoded) => {
      if(err){
        return res.status(500).send(
          { 
            auth: false, 
            message:'토큰 인증에 실패하였습니다.'
          }
        );
      }

      User.findByPk(decoded.id)
          .then(data=> {
            if(!data){
              return res.status(404).send({"success":"0", "message" :"해당사용자를 찾지 못하였습니다."});
            } else {
              return res.status(200).send(data);
            }
          })
          .catch(err=> {
            console.log(err);
            return res.status(500).send({"success":"0", "message" :"해당사용자를 찾는데 문제가 발생하였습니다."});
          });

    }
  );
};

exports.findById = (req, res, next) => {
  User.findByPk(req.userId)
      .then(data=>{
        res.status(200).send(data);
      })
      .catch(err=>{
        res.status(500).send({success:"0", message :"해당사용자를 찾는데 문제가 발생하였습니다."});
      })
};
