import path from "path";
import express,{Request,Response,ErrorRequestHandler, NextFunction} from 'express'
import dotenv from 'dotenv'
import AuhtRouter from './routers/AuthRouter'
import AuthItem from './routers/AuthItem'
import AdminRouter from './routers/AdminRouter'
import cors from 'cors'
import { MulterError } from "multer";
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from './swagger.json'
dotenv.config()
const server = express()

server.use(express.urlencoded({extended:true}))
server.use(express.static(path.join(__dirname,'../public')))
const corsOptions = {
     origin: 'http://localhost:3000', 
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
     credentials: true,
     optionsSuccessStatus: 200
   };
   
server.use(cors(corsOptions));
server.use(AuhtRouter)
server.use(AuthItem)
server.use(AdminRouter)

server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

server.use((req:Request,res:Response,next:NextFunction)=>{
     res.json({error:'endpoint não encontrado'}).status(404)
})
const errorHandler: ErrorRequestHandler = (err:Error, req:Request, res:Response, next:NextFunction) => {
    if(err instanceof MulterError){
          res.json({error:err.code,errorField:err.field,errorMessage:err.message}).status(400)
    }
    else{
     res.json({error:'Error ao enviar imagem'}).status(400)
    }
 }
 server.use(errorHandler);
server.listen(process.env.PORT)