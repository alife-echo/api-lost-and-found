import path from "path";
import express,{Request,Response,ErrorRequestHandler} from 'express'
import dotenv from 'dotenv'
import AuhtRouter from './routers/AuthRouter'
dotenv.config()
const server = express()

server.set('views',path.join(__dirname,'./views'))
server.set('view engine','mustache')
server.use(express.urlencoded({extended:true}))
server.use(express.static(path.join(__dirname,'../public')))
server.use(AuhtRouter)
server.use((req:Request,res:Response)=>{
     res.json({error:'pagina não encontrada'}).status(404)
})
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
     res.status(400); // Bad Request
     console.log(err);
     res.json({ error: 'Ocorreu algum erro.' });
 }
 server.use(errorHandler);
server.listen(process.env.PORT)