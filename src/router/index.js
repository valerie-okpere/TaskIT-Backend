const { Router } = require("express");
const internRoutes = require("../interns/router");
const adminRoutes = require("../admin/router");

const router = Router();

router.use("/", internRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
