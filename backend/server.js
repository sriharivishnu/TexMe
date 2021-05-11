import express from "express";
import cors from "cors";

const app = express();

import { getSVG, getPNG, getPDF } from "./controllers/latex-controller.js";

const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("TexMe API");
});

// POST /latex
app.post("/latex", (req, res) => {
  const { latex, format } = req.body;
  if (!latex) return res.status(400).send("No input!");
  switch (format) {
    case "SVG":
      return getSVG(res, latex);
    default:
      return res.status(400).send({ Error: `Unknown Format: ${format}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
