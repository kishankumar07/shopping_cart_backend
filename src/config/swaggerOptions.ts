import { Options } from 'swagger-jsdoc'

const swaggerOptions:Options = {
      definition:{
            openapi: '3.0.0',
            info:{
                  title:"Api documentation for monolithic_ts app",
                  version:'1.0.0',
                  description:"API documentation for this app",
            },
            servers:[
                  {
                        url:'https://shopping-cart-backend-ag7z.onrender.com',
                        description:'Production server'
                  }
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
      },
      apis:['./src/api/**/*.ts'],
}

export default swaggerOptions