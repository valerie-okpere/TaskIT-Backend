const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const { version } = require("../../package.json");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LOGBOOK API DOCS", // Title (required)
      version, // Version (required)
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/index.js",
    "./src/interns/router.js",
    "./src/mongodb.js",
    "./src/admin/router.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app, PORT) {
  app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  app.get("docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Docs available at http://localhost:${PORT}/docs`);
}

module.exports = swaggerDocs;
