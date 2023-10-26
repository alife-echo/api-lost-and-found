import { Router } from "express";
import { Auth } from "../middlewares/Auth";
import * as AdminControllers from '../controllers/AdminControllers'

const routers = Router()

routers.get('/listUsers',Auth.private,AdminControllers.listUsers)

routers.get('/judgment-items',Auth.private,Auth.private,AdminControllers.listItemsJudgment)

export default routers