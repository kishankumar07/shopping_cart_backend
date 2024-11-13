import express, { Application } from 'express'
import cors from 'cors'
import path from 'path'
import {customer,product,shopping} from './api/index'
import swaggerUi from 'swagger-ui-express'
import ErrorHandler from './utils/error-handler'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerOptions from './config/swaggerOptions'

const swaggerSpec = swaggerJSDoc(swaggerOptions)

export default (app:Application)=>{
      app.use(express.json({limit:'1mb'}));
      app.use(express.urlencoded({extended:true,limit:'1mb'}));
      app.use(cors());
      app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))

       //api
       customer(app);
       product(app);
       shopping(app);
 
       //error handling
       app.use(ErrorHandler)
}
