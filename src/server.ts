import path from "path";
import express,{Request,Response,ErrorRequestHandler, NextFunction} from 'express'
import dotenv from 'dotenv'
import AuhtRouter from './routers/AuthRouter'
import AuthItem from './routers/AuthItem'
import AdminRouter from './routers/AdminRouter'
import cors from 'cors'
dotenv.config()
const server = express()

server.use(express.urlencoded({extended:true}))
server.use(express.static(path.join(__dirname,'../public')))
const corsOptions = {
     origin: 'http://localhost:3000', // A origem permitida
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
     credentials: true, // Permite o envio de cookies junto com a requisição
     optionsSuccessStatus: 200
   };
   
server.use(cors(corsOptions));
server.use(AuhtRouter)
server.use(AuthItem)
server.use(AdminRouter)

server.use((req:Request,res:Response,next:NextFunction)=>{
     res.json({error:'endpoint não encontrado'}).status(404)
})
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
     res.status(400); // Bad Request
     console.log(err);
     res.json({ error: 'Ocorreu algum erro.' });
 }
 server.use(errorHandler);
server.listen(process.env.PORT)