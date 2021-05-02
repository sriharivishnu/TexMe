const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/latex", (req, res) => {
  res.send(req.body);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
