import express,{Request,Response} from 'express'
import * as UserService from '../services/UserService'
import  Jwt  from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import { sendEmail } from '../helpers/sendEmail';
import { validateEmail } from '../helpers/validateEmailUnifesspa';


export const login = async (req:Request,res:Response) =>{
    if(req.body.email && req.body.password) {
        let email: string = req.body.email;
        let password: string = req.body.password;
        const user = await UserService.findByEmail(email)
        if(user && UserService.matchPassword(password,user.password) && user.validated === 1) {
            const token = Jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET_KEY as string,{expiresIn:'1hr'})
            res.status(200).json({ status: true,token,id:user.id });            
        }
        else{
            res.status(400).json({status:false,error:'usuario não encontrado'})
        }
    }
    else{
        res.status(400).json({ status: false ,error:'Insira os dados corretamente'});
    }

}
export const register = async (req:Request,res:Response) =>{
    if(req.body.name && req.body.email && req.body.password) {
        let {name, email, password  } = req.body;
        const hasUser = await UserService.findByEmail(email)
        if(hasUser){
            res.status(409).json({error:'Email ja existe'})
        }
        else if (!hasUser && validateEmail(email)) {
            const newUser= await UserService.createUser(name,email,password) as Prisma.UserCreateInput
            const token = Jwt.sign({id:newUser.id,email:newUser.email},process.env.JWT_SECRET_KEY as string,{expiresIn:'1hr'})
            res.status(201).json({ id: newUser.id,token });
            sendEmail(newUser.email,res,'SEU CÓDIGO DE CONFIRMAÇÃO',newUser.code,'Confirmação de E-mail')
        }
        else {
            res.status(400).json({ error: 'Apenas email institucional' });
        }
    }
    else {
        res.status(400).json({ error: 'Insira os dados corretamente' });
    }
}
export const email_confirm = async (req:Request,res:Response) => {
    if(req.body.code){
         const validated = await UserService.validatedCode(req.body.code)
         if(validated instanceof Error){
            res.status(400).json({error:validated.message})
         }
         else{
            res.status(200).json({ok:'Usúario validado com sucesso'})
         }
    }
    else{
        res.status(400).json({error:'Código não inserido'})
    }

}
//2bs10
export const sendEmailToken = async (req:Request,res:Response) =>{
    if(req.body.email){        
        const user = await UserService.findByEmail(req.body.email)
        if(user){
            const token = Jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET_KEY as string,{expiresIn:'1hr'})
            sendEmail(user.email,res,'SEU TOKEN PARA ALTERAÇÃO',user.tokenRetrieve,'Alteração de senha')
            res.status(200).json({ok:'Token enviado com sucesso',token})
        }
        else{
            res.status(400).json({error:'Usuario não encontrado'})
        }
        
    }else{
        res.status(400).json({error:'Email não enviado'})
    }
}
export const retrieve = async (req:Request,res:Response) =>{
      if(req.body.token && req.body.password){
         const newPassword = await UserService.new_password(req.body.token,req.body.password)
         if(newPassword instanceof Error){
            res.status(400).json({error:newPassword.message})
         }
         else{
            res.status(200).json({ok:'Senha alterada com sucesso'})
         }
      }
      else{
        res.status(400).json({error:'Token e/ou senha não enviados.'})
      }
}
export const validatedToken = (req:Request,res:Response) =>{
     res.status(200).json({status:true})
}
