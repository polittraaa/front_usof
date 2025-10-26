import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes/path.js'
import AdminJS from 'adminjs'
import Plugin from '@adminjs/express'
import { Adapter, Database, Resource } from '@adminjs/sql'
import session from 'express-session'
import { makeNewUserHash } from './usof/new_user_hash.js'
import { trimInputs } from './middlewares/trim_input.js'
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()

AdminJS.registerAdapter({
  Database,
  Resource,
})

const start = async () => {
  const app = express();
  const PORT = process.env.SERVER_PORT;
  
  const db = await new Adapter('mysql2', {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
  }).init()

  const admin = new AdminJS({
    resources: [
      makeNewUserHash(db),// extra for admin auth 
      // { resource: db.table('users') },
      { resource: db.table('posts') },
      { resource: db.table('categories') },
      { resource: db.table('post_categories') },
      { resource: db.table('comments') },
      { resource: db.table('likes') },
      { resource: db.table('favorites') },
    ],
  })

  admin.watch();

  const adminRouter = Plugin.buildRouter(admin)
  app.use(admin.options.rootPath, adminRouter)
  app.use(trimInputs)
  app.use(bodyParser.json())
  app.use(cookieParser())

  app.use(cors({
    origin: 'http://localhost:5173', // front
    credentials: true               // cocies
  }));

  app.use( session({
      secret: process.env.COOKIE_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: { secure: false },
    })
  )
  // app.use(express.static('public'));
  app.use("/public", express.static(path.join(__dirname, "public")));

  app.use('/api', routes)


  app.listen(PORT, () => {
    console.log(`Listen at http://localhost:${PORT}`)
  })
}

start()
