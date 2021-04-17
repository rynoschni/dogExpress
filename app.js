"use strict";

const http = require("http");

const hostname = "127.0.0.1";
const port = 3333;

const express = require("express");
const app = express();

const morgan = require('morgan');
const logger = morgan('tiny');
app.use(logger);

const helmet = require("helmet");
app.use(helmet());

const es6Renderer = require("express-es6-template-engine");

app.engine("html", es6Renderer);
app.set("views", "templates");
app.set("view engine", "html");

const server = http.createServer(app);

const db = require("./db");

server.listen(port, hostname, () => {
  console.log(`YO JOE!  Coming in hot on http://${hostname}:${port}`);
});

app.all('*', (req, res, next) => {
  console.log("I'm SnakeEyes, sneaking in the middle.");
  next();
});

app.get("/", (req, res) => {
  res.render("index", {
    locals: {
      dogs: db,
      path: req.path,
      title: "My Address App",
    },
    partials: {
      head: "/partials/head",
      home: "/partials/home",
    },
  });
});

app.get("/friends/:name", (req, res) => {
  console.log(req.params.name);
  var { name } = req.params;

  var friend = db.find((thisFriend) => thisFriend.name === name);

  if (friend) {
    res.render("friend", {
      locals: {
        friend,
        title: "My Friend",
      },
      partials: {
        head: "/partials/head",
      },
    });
  } else {
    res.send("Sargent Slaughter says NOOOO!").status(404);
  }
});
