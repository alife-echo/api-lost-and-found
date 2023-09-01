import { Router } from "express";
import * as AuthController from '../controllers/AuthControllers'
import { Auth } from "../middlewares/Auth";
const routers = Router()

routers.post('/post-login',AuthController.login)

routers.post('/register-post',AuthController.register)

routers.post('/retrieve-post',AuthController.retrieve)

routers.post('/confirm-email-post',AuthController.email_confirm)

routers.post('/send-token-post',AuthController.sendEmailToken)


export default routers