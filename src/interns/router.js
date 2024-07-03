const { Router } = require("express");
const express = require("express");
const {
  handleResponse,
  searchIntern,
  searchAdmin,
  validateToken,
} = require("../utils/helperFunctions");

const {
  internLogin,
  internSignup,
  internHomePage,
  internProfile,
  internReportUpload,
  internPreview,
  internPreviewSearch,
  internChangePassword,
  internLogout,
} = require("./controller");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = Router();
const cors = require("cors");

router.use(express.json());
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

router.post("/login", async (req, res) => {
  /**
   * @openapi
   * /login:
   *   post:
   *     tags:
   *       - Interns
   *     description: This page is to confirm the user accessing the page
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *              - email
   *              - password
   *             properties:
   *               email:
   *                type: string
   *                default: ""
   *                description: "the email of the user"
   *               password:
   *                type: string
   *                default: ""
   *                description: "the password of the user"
   *     responses:
   *       '200':
   *         description: Access confirmed
   *       '400':
   *         description: Bad request
   *       '409':
   *         description: Conflict
   *
   */

  await internLogin(req, res);
});

router.post("/signup", async (req, res) => {
  /**
   * @openapi
   * /signup:
   *   post:
   *     tags:
   *       - Interns
   *     description: This is to create an account for the user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SignUpInput'
   *     responses:
   *       '200':
   *         description: Creation successful
   *       '409':
   *         description: Conflict
   *       '400':
   *         description: Bad request
   */
  await internSignup(req, res);
});

router.get("/home", validateToken, async (req, res) => {
  /**
   * @openapi
   * paths:
   *   /home:
   *     get:
   *       tags:
   *         - Interns
   *       description: App home page
   *       responses:
   *         '200':
   *           description: Success
   *           content:
   *             application/json:
   *               schema:
   *                 allOf:
   *                   - $ref: '#/components/schemas/SignUpInput'
   *                   - $ref: '#/components/schemas/ReportInput'
   *         '400':
   *           description: Bad request
   *         '500':
   *           description: Token authorization failed
   *
   */
  await internHomePage(req, res);
});

router.get("/profile", validateToken, async (req, res) => {
  /**
   * @openapi
   * /profile:
   *   get:
   *     tags:
   *       - Interns
   *     description: This is to view the profile information of users
   *     responses:
   *       '200':
   *         description: Successful
   *       '400':
   *         description: Bad request
   *       '500':
   *           description: Token authorization failed
   */
  await internProfile(req, res);
});

router.post("/report", validateToken, async (req, res) => {
  /**
   * @openapi
   * /report:
   *   post:
   *     tags:
   *       - Interns
   *     description: This is to create users' report
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ReportInput'
   *     responses:
   *       '200':
   *         description: Upload successful
   *       '409':
   *         description: Conflict
   *       '400':
   *         description: Bad request
   */
  await internReportUpload(req, res);
});

router.get("/preview", validateToken, async (req, res) => {
  /**
   * @openapi
   * paths:
   *   /preview:
   *     get:
   *       tags:
   *         - Interns
   *       description: This is to preview recent upload
   *       requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ReportInput'
   *       responses:
   *         '200':
   *           description: Successful
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/ReportInput'
   *         '400':
   *           description: Bad request
   *
   */
  await internPreview(req, res);
});

router.post("/preview/search", validateToken, async (req, res) => {
  /**
   * @openapi
   * /preview/search:
   *   post:
   *     tags:
   *       - Interns
   *     summary: Preview search
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             oneOf:
   *               - required: [ 'search' ]
   *               - required: [ 'date' ]
   *             properties:
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
  await internPreviewSearch(req, res);
});

router.patch("/changePassword", validateToken, async (req, res) => {
  /**
   * @openapi
   * /changePassword:
   *   patch:
   *     tags:
   *       - Interns
   *     description: This page is to confirm the user accessing the page
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *              - oldPassword
   *              - newPassword
   *              - confirmPassword
   *             properties:
   *               oldPassword:
   *                type: string
   *                default: ""
   *                description: "old password of user"
   *               newPassword:
   *                type: string
   *                default: ""
   *                description: "new password of the user"
   *               confirmPassword:
   *                type: string
   *                default: ""
   *                description: "updated password of the user"
   *     responses:
   *       '200':
   *         description: Successful
   *       '400':
   *         description: Bad request
   *       '409':
   *         description: Conflict
   *
   */
  await internChangePassword(req, res);
});

router.get("/logout", validateToken, async (req, res) => {
  /**
   * @openapi
   * /logout:
   *   get:
   *     tags:
   *       - Interns
   *     description: This is to log a user out from the account
   *     responses:
   *       '200':
   *         description: Logout successful
   */
  await internLogout(req, res);
});

module.exports = router;
