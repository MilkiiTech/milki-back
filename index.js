const express = require("express");
const { json } = require("body-parser");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const debug = require("debug")("app:server");
const config = require("./config/config");
const db = require("./config/db");
const options=require("./config/swagger.config")
const path = require("path");
// const logger = require("./configs/logger");
const fs = require("fs");
const http = require("http");
const user = require("./user/index");
const structure = require("./structure/index")
const app = express();
app.use(helmet());
app.disable("x-powered-by");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);
const specs = swaggerJsdoc(options);

app.use(cors("*"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/user", user);
app.use("/api/structure", structure);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that Api!");
});

app.use(function (err, req, res, next) {
  res.status(err.statusCode || 500);
  res.json({ error: err.message });
});

const server = http.createServer( app);
server.listen(config.get('port', config.get('ip'), ), () => {
  var addy = server.address();
  console.log(addy);
  console.log('running on http://' + addy.address + ':' + addy.port);
});

// const io = require("./utils/socket").init(server);
// io.on("connection", socket=>{
//   console.log("Client connected!")
// });
module.exports = server;
