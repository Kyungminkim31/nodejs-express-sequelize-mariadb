"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");


const db = require('./app/models');
const serveStatic = require('serve-static');
const history = require('connect-history-api-fallback');

var app = express();
app.use(history());

var corsOptions = {
  orgin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));

// use ./dist directory as static
app.use(serveStatic(__dirname + "/dist"));

db.sequelize.sync({force:true}).then(()=>{
  console.log('Drop and re-sync db.');
});  

app.get("/", (req, res)=>{
  res.json({message: "Welcome to kyungmin's application."});
});

require('./app/routes/tutorial.routes')(app);

// 상품 메뉴
require('./app/routes/product.routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
