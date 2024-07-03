const { Router } = require("express");
const express = require("express");
const {
  handleResponse,
  searchAdmin,
  validateToken,
  adminValidateToken,
} = require("../utils/helperFunctions");
const {
  adminSignUp,
  adminHome,
  adminPreview,
  adminPreviewSearch,
  adminProfile,
  adminDelete,
  adminHomeSearch,
} = require("./controller");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = Router();
const cors = require("cors");
const session = require("express-session");

router.use(express.json());
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

router.post("/signup", async (req, res) => {
  await adminSignUp(req, res);
});

router.get("/home", adminValidateToken, async (req, res) => {
  /**
   * @openapi
   * paths:
   *   /admin/home:
   *     get:
   *       tags:
   *         - Admins
   *       description: App admin homepage
   *       responses:
   *         '200':
   *           description: Available intern objects
   *         '400':
   *           description: You dont have access to this page
   *         '401':
   *           description: Currently no interns
   *
   */
  await adminHome(req, res);
});

router.get("/preview", adminValidateToken, async (req, res) => {
  /**
   * @openapi
   * /admin/preview:
   *   get:
   *     tags:
   *       - Admins
   *     description: Admin preview page
   *     responses:
   *       '200':
   *         description: Intern reports
   *       '201':
   *         description: Currently no reports
   *       '400':
   *         description: You do not have access to this page
   */
  await adminPreview(req, res);
});

router.get("/profile", adminValidateToken, async (req, res) => {
  /**
   * @openapi
   * /admin/profile:
   *   get:
   *     tags:
   *       - Admins
   *     summary: Admin Profile
   *     responses:
   *       200:
   *         description: Admin details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AdminSignUpInput'
   *       400:
   *         description: You have to log in
   */
  await adminProfile(req, res);
});

router.post("/home/search", adminValidateToken, async (req, res) => {
  /**
   * @openapi
   * /admin/home/search:
   *   post:
   *     tags:
   *       - Admins
   *     summary: Admin home search
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *              - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 default: ''
   *     responses:
   *       200:
   *         description: 'Intern found or not'
   *       400:
   *         description: 'Bad Request '
   */
  await adminHomeSearch(req, res);
});

router.get("/preview/search", adminValidateToken, async (req, res) => {
  /**
   * @openapi
   * /admin/preview/search:
   *   post:
   *     tags:
   *       - Interns
   *     summary: Admin preview search
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             oneOf:
   *               - required: [ 'email' ]
   *               - required: [ 'search' ]
   *               - required: [ 'date' ]
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 default: ''
   *               search:
   *                 type: string
   *                 default: ''
   *               date:
   *                 type: string
   *                 format: date
   *                 default: ''
   *     responses:
   *       200:
   *         description: 'Report found or not'
   *       400:
   *         description: 'Bad Request'
   */
  await adminPreviewSearch(req, res);
});

router.delete("/delete", adminValidateToken, async (req, res) => {
  /**
   * @openapi
   * /admin/delete:
   *   delete:
   *     tags:
   *       - Admins
   *     description: Admin delete action
   *     responses:
   *       '200':
   *         description: Deletion successful
   */
  await adminDelete(req, res);
});

router.get("/logout", async (req, res) => {
  req.session.token = undefined;
  await internLogout(req, res);
});

module.exports = router;
