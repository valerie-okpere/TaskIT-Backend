const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = require("../src/router/index");
const { handleResponse } = require("../src/utils/helperFunctions");
const swaggerDocs = require("../src/utils/swagger");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser("Logbook Backend"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(router);
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return handleResponse(res, 200, "Backend Running");
});

app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
  swaggerDocs(app, PORT);
});
