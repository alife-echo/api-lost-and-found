import { Router } from "express";
import { Auth } from "../middlewares/Auth";
import * as AdminControllers from '../controllers/AdminControllers'

const routers = Router()

routers.get('/listUsers',Auth.private,AdminControllers.listUsers)

export default routers