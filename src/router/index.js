 const { Router } = require("express");
const express = require("express");
const internRoutes = require("../interns/router");
const adminRoutes = require("../admin/router");

const router = Router();
const app = express();

router.use("/", internRoutes);

module.exports = router;

