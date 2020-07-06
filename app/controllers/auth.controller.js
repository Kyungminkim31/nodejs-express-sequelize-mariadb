'use strict';

const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

var jwt=require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config/auth.config');

exports.register = (req, res) => {

  if(!req.body.email) {
    res.status(400).send({
      message: "email can not be empty!"
    });
    return;
  }

  if(!req.body.password){
    res.status(400).send({
      message: "password can not be empty!"
    });
    return;
  }

  if(!req.body.name){
    res.status(400).send({
      message: "name can not be empty!"
    });
    return;
  }

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  const user = {
    name: req.body.name,
    password: hashedPassword,
    email: req.body.email
  };

  User.create(user)
  .then(data=>{
    console.log(data.id);
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
  const id = req.params.id;
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
          res.status(404).send({"success":"0", "message" :"해당사용자를 찾지 못하였습니다."});
        } else {
          res.status(200).send(data); 
        }
      })
      .catch(err=> {
        res.status(500).send({"success":"0", "message" :"해당사용자를 찾는데 문제가 발생하였습니다."});
      });
    }
  );
};