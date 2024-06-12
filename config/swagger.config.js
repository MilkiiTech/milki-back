const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Moosaajii',
        version: '1.0.0',
        description: 'Student Management System covered Create, Read, Update, and Delete operations using a Node.js API',
      },
      servers:[
        {url:'http://:::8080/api'}, //you can change you server url
      ],
    },
  
    apis: ['./routes/*.js'], //you can change you swagger path
  };

  module.exports=options;