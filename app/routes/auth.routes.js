'use strict';

module.exports = app => {
  const auth = require("../controllers/auth.controller.js");

  var router = require("express").Router();

  router.get("/hey", (req, res)=>{
    console.log("Hey!");
    res.send(401);
  })

  router.post("/register", auth.register);

  router.get("/verify", auth.authToken);

  app.use('/api/auth', router);  

};