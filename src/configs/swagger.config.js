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
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT 토큰을 사용한 인증. Authorization 헤더에 'Bearer {token}' 형식으로 전달합니다.",
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/**/*.js"],
};

export const specs = swaggerJSDoc(options);
