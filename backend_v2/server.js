const express = require("express");
const app = express();
var cors = require("cors");

var mathJax = require("mathjax-node");
mathJax.config({
  MathJax: {},
});
mathJax.start();

const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello TexMe");
});

app.post("/latex", (req, res) => {
  const math = req.body.latex;
  if (!math) return res.status(400).send("No input!");
  mathJax.typeset({ math: math, format: "TeX", svg: true }, (data) => {
    console.log(data);
    return res.status(200).send({ svg: data.svg });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
