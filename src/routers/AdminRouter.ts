import { Router } from "express";
import { Auth } from "../middlewares/Auth";
import * as AdminControllers from '../controllers/AdminControllers'

const routers = Router()


routers.get('/judgment-items',Auth.admin,AdminControllers.listItemsJudgment)

routers.delete('/destroyed-item/:id',Auth.admin,AdminControllers.deleteItem)

routers.delete('/destroyed-user/:userId',Auth.admin,AdminControllers.bannedUser)

routers.get('/findUser/:id',Auth.admin,AdminControllers.findByIdUser)


export default routers