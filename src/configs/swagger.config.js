import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "soksak",
      version: "1.0.0",
      description: "UMC Node.js Server API",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "로컬 서버"
      },
      {
        url: "https://api.soksak-letter.com",
        description: "배포 서버"
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/**/*.js"],
};

export const specs = swaggerJSDoc(options);
