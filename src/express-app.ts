import express, { Application } from 'express'
import cors from 'cors'
import path from 'path'
import {customer,product} from './api/index'

export default (app:Application)=>{
      app.use(express.json({limit:'1mb'}));
      app.use(express.urlencoded({extended:true,limit:'1mb'}));
      app.use(cors());

       //api
       customer(app);
       product(app);
      //  shopping(app);
 
       //error handling
       // to be filled here
}