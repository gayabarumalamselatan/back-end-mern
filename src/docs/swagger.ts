import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v0.0.1",
    title: "Dokumentasi API Acara",
    description: "Dokumentasi API Acara",
  },
  servers:[
    {
      url: "http://localhost:3000/api",
      description: "Local Server"
    },
    {
      url: "https://back-end-mern-chi.vercel.app/api",
      description: "Deploy Server",
    }
  ],
  components:{
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      }
    },
    schemas: {
      LoginRequest: {
        identifier: "test@email.com",
        password: "test",
      }
    }
  },
};

const outputFile = "./swagger_output.json";
const endpointsFile = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFile, doc)