import dotenv from 'dotenv'
 
dotenv.config();
 
if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
      const configFile = `./.env.${process.env.NODE_ENV}`;
      console.log('Using config file:', configFile);
      dotenv.config({ path: configFile });
  }else{
      console.log('Using default config file or production environment.');
}

// console.log('This is the port for the app from ./config/index.ts:',process.env.PORT);

export const PORT = process.env.PORT;
export const DB_URL = process.env.MONGODB_URI;
export const APP_SECRET = process.env.APP_SECRET;