'use strict';

module.exports = (sequelize, Sequelize)=>{
  const Product = sequelize.define("product", {
    name:{  // 상품명
      type: Sequelize.STRING
    },
    description: {  // 명세
      type: Sequelize.STRING
    },
    use_checked: {  // 사용 여부
      type: Sequelize.BOOLEAN
    }
  });

  return Product;
};