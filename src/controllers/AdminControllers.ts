import express,{Request,Response} from 'express'
import * as AdminService from '../services/AdminService'
export const listUsers = async(req:Request,res:Response)=>{
    
}

export const listItemsJudgment = async (req:Request,res:Response) =>{
     const items = await AdminService.getListItem()
     if(items instanceof Error){
            res.json({error:items.message}).status(400)
     }
     else{
            res.json({items}).status(200)
     }
}
export const deleteItem = async (req:Request,res:Response) =>{
       const destroyedItem = await AdminService.deleteItem(req.params.id)
       if(destroyedItem instanceof Error){
              res.json({error:destroyedItem.message}).status(400)
       }
       else{
              res.json({ok:destroyedItem}).status(200)
       }
}

export const findByIdUser = async (req:Request,res:Response) =>{
       const user = await AdminService.infoUser(req.params.id)
       if(user instanceof Error){
              res.json({error:user.message}).status(400)
       }
       else{
              res.json({user}).status(200)
       }
}

export const bannedUser = async (req:Request,res:Response)=>{
       const deleteUser = await AdminService.deleteUser(req.params.userId)
       if(deleteUser instanceof Error){
              res.json({error:deleteUser.message}).status(400)
       }
       else{
              res.json({deleteUser}).status(410)
       }
}