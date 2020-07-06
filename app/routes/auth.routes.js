'use strict';

module.exports = app => {
  const auth = require("../controllers/auth.controller.js");
  const VerifyToken = require("../controllers/auth.verifyToken"); 

  var router = require("express").Router();

  router.post("/register", auth.register);

  // router.get("/verify", auth.authToken);
  router.get("/verify", VerifyToken, auth.findById);

  router.post("/login", auth.login);

  router.get("/logout", auth.logout);

  app.use('/api/auth', router);  

};