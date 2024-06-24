const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = require("../src/router/index");
const { handleResponse } = require("../src/utils/helperFunctions");
const session = require("express-session");
const swaggerDocs = require("../src/utils/swagger");

const PORT = process.env.PORT || 5000;
const app = express();
const templatePath = path.join(__dirname, "../templates");

app.use(express.json());
app.use(cookieParser("Logbook Backend"));
app.use(
  session({
    secret: "Valerie Okpere",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60 * 24,
    },
  })
);
app.use(router);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.set("views", templatePath);

app.get("/", (req, res) => {
  req.session.visited = true;
  return handleResponse(res, 200, "Backend Running");
});

app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
  swaggerDocs(app,PORT);
});