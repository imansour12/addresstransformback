require("dotenv").config();
const express = require("express");
const { TextServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
const app = express();
const cors = require("cors");
var postal = require("node-postal");

const port = 3000;
const API_KEY = process.env.API_KEY;
const MODEL_NAME = "models/text-bison-001";

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/formataddr", async (req, res) => {
  const input = req.body.input;
  res.send(postal.parser.parse_address(input));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
