/**
 * @openapi
 * components:
 *   schemas:
 *     SignUpInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - confirmPassword
 *         - duration
 *       properties:
 *         firstName:
 *           type: string
 *           default: ""
 *           description: "First name of the user"
 *         lastName:
 *           type: string
 *           default: ""
 *           description: "Last name of the user"
 *         email:
 *           type: string
 *           format: email
 *           default: ""
 *           description: "Email address of the user"
 *         password:
 *           type: string
 *           format: password
 *           default: ""
 *           description: "Password for the user account"
 *         confirmPassword:
 *           type: string
 *           format: password
 *           default: ""
 *           description: "Password confirmation"
 *         duration:
 *           type: string
 *           default: ""
 *           description: "Duration of the internship or program"
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     AdminSignUpInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         firstName:
 *           type: string
 *           default: ""
 *           description: "First name of the user"
 *         lastName:
 *           type: string
 *           default: ""
 *           description: "Last name of the user"
 *         email:
 *           type: string
 *           format: email
 *           default: ""
 *           description: "Email address of the user"
 *         password:
 *           type: string
 *           format: password
 *           default: ""
 *           description: "Password for the user account"
 *         confirmPassword:
 *           type: string
 *           format: password
 *           default: ""
 *           description: "Password confirmation"
 *
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     ReportInput:
 *       type: object
 *       required:
 *         - day
 *         - taskTitle
 *         - taskDescription
 *         - date
 *       properties:
 *         day:
 *           type: string
 *           default: ""
 *           description: "The day of the documentation upload"
 *         taskTitle:
 *           type: string
 *           default: ""
 *           description: "The title of the task being documented"
 *         taskDescription:
 *           type: string
 *           default: ""
 *           description: "The description of the task being documented"
 *         date:
 *           type: date
 *           default: ""
 *           description: "Date of documentation"
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     LogInInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           default: ""
 *           description: "Email"
 *         password:
 *           type: string
 *           default: ""
 *           description: "Password"
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     UserInfo:
 *       type: object
 *       properties:
 *         role:
 *           type: string
 *         _id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         duration:
 *           type: string
 *         token:
 *           type: string
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         __v:
 *           type: integer
 *     TaskInfo:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *         week:
 *           type: integer
 *         day:
 *           type: string
 *         taskTitle:
 *           type: string
 *         taskDescription:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         __v:
 *           type: integer
 *     ApiResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/UserInfo'
 *         info:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TaskInfo'
 *     Task:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *         week:
 *           type: integer
 *         day:
 *           type: string
 *         taskTitle:
 *           type: string
 *         taskDescription:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         __v:
 *           type: integer
 *     TaskArrayResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Task'
 *
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     LoginSuccessResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT used for authenticating subsequent requests.
 *         message:
 *           type: string
 *           description: Description of the login result.
 *       example:
 *         token: "string"
 *         message: "Intern login successful"
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     AdminHomeResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/UserInfo'
 *         info:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserInfo'
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     AdminPreviewResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TaskInfo'
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     AdminProfileDataResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/UserInfo'
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     TaskArrayDataResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TaskInfo'
 */
