const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const { version } = require("../../package.json");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LOGBOOK API DOCS",
      version,
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          // Changed from bearerAuth to ApiKeyAuth
          type: "apiKey",
          in: "header",
          name: "Authorization", // The name of the header to be used
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [], // Apply ApiKeyAuth globally to all endpoints
      },
    ],
  },
  apis: [
    "./src/index.js",
    "./src/interns/router.js",
    "./src/admin/router.js",
    "./src/utils/schemas.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app, PORT) {
  app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  app.get("/docs.json", (req, res) => {
    // Make sure the path is correct
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Docs available at http://localhost:${PORT}/docs`);
}

module.exports = swaggerDocs;
