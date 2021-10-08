module.exports = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Community Platform RESTful API",
      description: "A documentation of Community Platform RESTful API",
      version: "1.0.0",
      contact: {
        name: "Community Platform Backend Team",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Localhost server",
      },
      {
        url: "http://http://139.162.3.23/:5000/api",
        description: "Production server",
      },
    ],
  },
  apis: ["../docs/**/*.js"],
};
