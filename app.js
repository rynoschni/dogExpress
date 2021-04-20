"use strict";

const http = require("http");

const hostname = "127.0.0.1";
const port = 3333;

const express = require("express");
const app = express();

const fetch = require("node-fetch");

const morgan = require("morgan");
const logger = morgan("tiny");
app.use(logger);

// const helmet = require("helmet");
// app.use(helmet());

const es6Renderer = require("express-es6-template-engine");

app.engine("html", es6Renderer);
app.set("views", "templates");
app.set("view engine", "html");

const server = http.createServer(app);

const db = require("./db");

// app.all("*", (req, res, next) => {
//   console.log("I'm SnakeEyes, sneaking in the middle.");
//   next();
// });

app.get("/", (req, res) => {
  console.log("Req Path", req.path);
  res.render("index", {
    locals: {
      dogs: db,
      path: req.path,
      title: "My Dog App",
    },
    partials: {
      head: "/partials/head",
      partial: "/partials/home",
    },
  });
});

app.get("/:slug", async (req, res) => {
  console.log(req.params.slug);
  const { slug } = req.params;

  let dog = db.find((singleDog) => singleDog.slug === slug);

  if (dog) {

    if (dog.apiSubBreed === null) {
      let url = `https://dog.ceo/api/breed/${dog.apiBreed}/images/random`
      console.log(url);

      const img = await fetch(url)
        .then((res) => res.json())
        .then((data) => data);
      console.log("dog data:", img);

      res.render("index", {
        locals: {
          dog,
          title: "My Dog",
          img,
        },
        partials: {
          head: "/partials/head",
          partial: "/partials/dog",
        },
      });
    } else {
      let url = `https://dog.ceo/api/breed/${dog.apiBreed}/${dog.apiSubBreed}/images/random`
      console.log(url);

      const img = await fetch(url)
        .then((res) => res.json())
        .then((data) => data);
      console.log("dog data:", img);

      res.render("index", {
        locals: {
          dog,
          title: "My Dog",
          img,
        },
        partials: {
          head: "/partials/head",
          partial: "/partials/dog",
        },
      });
    }

    
  } else {
    res.send("Sargent Slaughter says NOOOO!").status(404);
  }
});

server.listen(port, hostname, () => {
  console.log(`YO JOE!  Coming in hot on http://${hostname}:${port}`);
});
