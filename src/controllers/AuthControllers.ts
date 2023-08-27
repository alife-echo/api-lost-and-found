import express,{Request,Response} from 'express'
import * as UserService from '../services/UserService'

export const login = async (req:Request,res:Response) =>{
    if(req.body.email && req.body.password) {
        let email: string = req.body.email;
        let password: string = req.body.password;
        const user = await UserService.findByEmail(email)
        if(user && UserService.matchPassword(password,user.password) && user.validated === 1) {
            res.json({ status: true });
            return;
        }
    }

    res.json({ status: false });
}
export const register = async (req:Request,res:Response) =>{
    if(req.body.name && req.body.email && req.body.password) {
        let {name, email, password  } = req.body;
        const newUser = await UserService.createUser(name,email,password)
        if(newUser instanceof Error){
            res.status(400).json({error:newUser.message})
        }
        else {
            res.status(201).json({ id: newUser.id });
        }
    }
    else {
        res.status(400).json({ error: 'E-mail e/ou senha não enviados.' });
    }
}
export const retrieve = async (req:Request,res:Response) =>{
      
}

export const email_confirm = async (req:Request,res:Response) => {

}