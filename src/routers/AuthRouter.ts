import { Router } from "express";
import * as AuthController from '../controllers/AuthControllers'

const routers = Router()

routers.post('/post-login',AuthController.login)

routers.post('/register-post',AuthController.register)

routers.post('/retrieve-post',AuthController.retrieve)

routers.post('/confirm-email-post',AuthController.email_confirm)




export default routers