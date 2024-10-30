import express from 'express';
import dotenv from 'dotenv';
import routes from './app/routes/index'
import bodyParser from 'body-parser';
import { cors } from './config/cors';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });
const webserver = express();
webserver.use(cors);
// bodyParser Link: expressjs.com/en/resources/middleware/body-parser.html
webserver.use(bodyParser.json()) //bodyParser.json({limit: 100kb}) default limit for data size

// .use() function in ExpressJS is used to mount middleware functions to your application.
webserver.use(routes);

const port = 5002;
webserver.listen(port, () => {
  console.log(`TC POS Single Point Server`);
  console.log(`SERVER VERSION: ${process.env.SERVER_VERSION}`);
  console.log(`AUTHOR: ${process.env.AUTHOR}`);
  // console.log(`RELEASED DATE: MARCH 04, 2024`);
  console.log(`SERVER PORT: ${port}`);
  console.log(`-----------------------------`);
  console.log();
})