'use strict';

const db = require("../models");
const Product = db.products;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  
  if(!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const product = {
    name: req.body.name,
    description: req.body.description,
    use_checked: req.body.use_checked ? req.body.use_checked : false
  };

  Product.create(product)
    .then(data=>{
      res.send(data);
    })
    .catch(err=>{
      res.status(500).send({
        message:
          err.message || "상품 등록 중 오류가 발생하였습니다."
      });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Product.findAll({ where: condition })
    .then(data=> {
      res.send(data);
    })
    .catch(err=> {
      res.status(500).send({
        message:
          err.message || "상품 조회 중 오류가 발생하였습니다."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Product.findByPk(id)
    .then(data=> {
      res.send(data);
    })
    .catch(err=> {
      res.status(500).send({
        message: "상품 ID (" + id + ") 를 조회 중에 오류가 발생하였습니다."
      });
    });

};

exports.update = (req, res) => {
  const id = req.params.id;

  Product.update(req.body, {
    where: {id: id}
  }).then(num => {
    if(num ==1){
      res.send({
        message: "상품정보가 올바르게 수정되었습니다."
      });
    } else {
      res.send({
        message: `상품 아이디 (${id})를 수정하지 못하였습니다.`
      });
    }
  })
  .catch(err=>{
    console.log(err);
    res.status(500).send({
      message: `상품 아이디 (${id})를 수정 중 오류가 발생하였습니다.`
    });
  });
};

exports.delete = (req, res) => {

  const id = req.params.id;

  Product.destroy({
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "상품이 정상적으로 삭제되었습니다."
      });
    } else {
      res.send({
        message: `상품 ID (${id})를 삭제하지 못하였습니다. 내부 값에 오류가 예상됩니다.`
      });
    }
  })
  .catch(err=> {
    res.status(500).send({
      message : `상품ID (${id}) 삭제 중 오류가 발생하였습니다.`
    });
  });
};

exports.deleteAll = (req, res) => {
  Product.destroy({
    where : {},
    truncate: false
  })
  .then(nums=>{
    res.send({ message: `${nums} 개의 상품 삭제가 완료 되었습니다!`});
  })
  .catch(err=>{
    res.status(500).send({
      message: err.message || "상품 정보를 삭제 중 오류가 발생하였습니다."
    });
  });
};

exports.findAllChecked = (req, res) => {
  Product.findAll({where: {use_checked: true} })
    .then(data=>{
      res.send(data);
    })
    .catch(err=>{
      res.status(500).send({
        message:
          err.message || "사용 체크 된 상품 정보 조회 중 오류가 발상하였습니다."
      });
    });
};

  

