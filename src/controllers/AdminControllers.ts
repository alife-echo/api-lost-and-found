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