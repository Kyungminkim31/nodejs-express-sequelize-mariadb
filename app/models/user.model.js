'use strict';

module.exports = (sequelize, Sequelize)=>{
  const User = sequelize.define("user", {
    email:{  
      type: Sequelize.STRING
    },
    name:{
      type: Sequelize.STRING
    },
    role:{
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  });

  return User;
};