const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Moosaajii',
        version: '1.0.0',
        description: 'Student Management System covered Create, Read, Update, and Delete operations using a Node.js API',
      },
      servers: [
        { url: 'http://localhost:8080/api' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ['./user/routes/*.js', './structure/routers/zone/*.js', './structure/routers/woreda/*.js', './structure/routers/sector/*.js', './structure/routers/group/*.js', './structure/routers/work/*.js'],
  };
  
  module.exports = options;
  