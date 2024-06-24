const { Router } = require("express");
const express = require("express");
const {
  handleResponse,
  searchIntern,
  searchAdmin,
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

router.use(express.json());
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));

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
  const { email } = req.body;
  req.sessionStore.get(req.session.id, (err, sessionData) => {
    if (err) {
      console.log(err);
      throw err;
    }
  });
  const foundIntern = await searchIntern(email);
  const foundAdmin = await searchAdmin(email);

  if (!foundIntern && !foundAdmin) {
    return handleResponse(res, 400, "User does not exist");
  }
  req.session.email = email;
  req.session.visited = true;
  if (foundIntern) {
    req.body.foundIntern = foundIntern;
  } else if (foundAdmin) {
    req.body.foundAdmin = foundAdmin;
  }
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
   
router.get("/home", async (req, res) => {
  /**
 * @openapi
 * info:
 *   title: Interns API
 *   version: 1.0.0
 * paths:
 *   /home:
 *     get:
 *       tags:
 *         - Interns
 *       description: App home page
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

  req.body.email = req.session.email;
  req.body.foundIntern = req.session.foundIntern;
  await internHomePage(req, res);
});

router.get("/profile", async (req, res) => {
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
   */
  req.body.email = req.session.email;
  req.body.foundIntern = req.session.foundIntern;
  await internProfile(req, res);
});

router.post("/report", async (req, res) => {
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
  req.body.email = req.session.email;
  req.body.foundIntern = req.session.foundIntern;
  await internReportUpload(req, res);
});

router.get("/preview", async (req, res) => {
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
  req.body.email = req.session.email;
  req.body.foundIntern = req.session.foundIntern;
  await internPreview(req, res);
});

router.post("/preview/search", async (req, res) => {
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
  req.body.email = req.session.email;
  req.body.foundIntern = req.session.foundIntern;
  await internPreviewSearch(req, res);
});

router.patch("/changePassword", async (req, res) => {
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
  req.body.email = req.session.email;
  req.body.foundIntern = req.session.foundIntern;
  await internChangePassword(req, res);
});

router.get("/logout", async (req, res) => {
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
  req.session.email = undefined;
  req.session.foundIntern = undefined;
  await internLogout(req, res);
});

// ADMIN

router.post("/admin/signup", async (req, res) => {
  await adminSignUp(req, res);
});

router.get("/admin/home", async (req, res) => {
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
 *           description: Available intern emails
 *         '400':
 *           description: Bad request
 * 
 */
  const foundAdmin = await searchAdmin(req.session.email);

  if (!foundAdmin) {
    req.body.email = "";
    return handleResponse(res, 400, "You don't have access to this page");
  }
  req.body.email = req.session.email;
  await adminHome(req, res);
});


router.get("/admin/profile", async (req, res) => {
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
  const foundAdmin = await searchAdmin(req.session.email);
 
  if (!foundAdmin) {
    req.body.email = "";
    return handleResponse(res, 400, "You dont have access to this page");
  }
  req.body.foundAdmin = foundAdmin;
  req.body.email = req.session.email;
  await adminProfile(req, res);
});

router.post("/admin/home/search", async (req, res) => {
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

  const foundAdmin = await searchAdmin(req.session.email);
 
  if (!foundAdmin) {
    req.body.email = "";
    return handleResponse(res, 400, "You dont have access to this page");
  }
  req.body.foundAdmin = foundAdmin;
  req.body.email = req.session.email;
  await adminHomeSearch(req, res);
});

router.get("/admin/preview", async (req, res) => {
  /**
   * @openapi
   * /admin/preview:
   *   get:
   *     tags:
   *       - Admins
   *     description: Admin preview page
   *     responses:
   *       '200':
   *         description: Access granted
   */
  const foundAdmin = await searchAdmin(req.session.email);

  if (!foundAdmin) {
    req.body.email = "";
    return handleResponse(res, 400, "You don't have access to this page");
  }
  req.body.email = req.session.email;
  await adminPreview(req, res);
});

router.get("/admin/preview/search", async (req, res) => {
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
  const foundAdmin = await searchAdmin(req.session.email);

  if (!foundAdmin) {
    req.body.email = "";
    return handleResponse(res, 400, "You don't have access to this page");
  }
  req.body.internEmail = req.body.email;
  req.body.email = req.session.email;
  await adminPreviewSearch(req, res);
});

router.delete("/admin/delete", async (req, res) => {
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
  
  const foundAdmin = await searchAdmin(req.session.email);
 
  if (!foundAdmin) {
    req.body.email = "";
    return handleResponse(res, 400, "You dont have access to this page");
  }
  req.body.email = req.session.email;
  await adminDelete(req, res);

});




router.get("/admin/logout", async (req, res) => {

  req.session.email = undefined;

  req.session.foundAdmin = undefined;

  await internLogout(req, res);

});




module.exports = router;