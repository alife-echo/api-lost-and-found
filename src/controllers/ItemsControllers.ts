import express,{Request,Response} from 'express'
import * as itemService from '../services/ItemService'
import { ItemUploadData } from '../types/GlobalTypes';
import * as AdminService from '../services/AdminService'

import { getUserRef } from '../helpers/getUserRef';
import fs from 'fs'


export const upload = async (req:Request,res:Response)=>{
    if(req.body.nameItem && req.body.littleDescription && req.body.questionsValidated && req.body.meetingLocation && req.file?.fieldname && req.body.idUser){
        
        const imagePath = req.file.path;
        const imageBase64 = fs.readFileSync(imagePath, 'base64');
        
        const itemData:ItemUploadData = {
            name: req.body.nameItem,
            littleDescription: req.body.littleDescription,
            questionsValidated: req.body.questionsValidated,
            meetingLocation: req.body.meetingLocation,
            image: imageBase64, 
            userId:req.body.idUser
          };
        const item = await itemService.uploadItem(itemData)
        fs.unlinkSync(imagePath)
        if(item instanceof Error){
            res.status(400).json({error:item.message})
        }
        else{
            res.status(200).json({ok:'Upload realizado com sucesso'})
        }
    }
    else{
        res.json({error:'Informe os dados corretamente'})
    }
}

export const getListItems = async (req:Request,res:Response) =>{
     const token:string = req.query.token as string
     if(!token){
        res.json({error:'Token não existe'}).status(400)
     }
     const items = await itemService.getListItem(token)
     if(items instanceof Error){
        res.json({error:items.message})
     }
     else{
        res.status(200).json({items:items})
     }
     
}

export const getItem = async (req:Request,res:Response) =>{
     const id:string = req.params.id as string
     if(!id){
        res.json({error:'Não existem item'}).status(400)
     }
     const hasItem = await itemService.getItemID(id)
     if(hasItem instanceof Error){
         res.status(400).json({error:hasItem.message})
     }
     else{
       res.status(200).json({item:hasItem.item,responses:hasItem.getResponses})
     }
}

export const responseItem = async (req:Request,res:Response) =>{
        if(req.body.textResponse && req.body.token && req.body.idItem){
            const hasResponseItem = await itemService.sendReponseItem(req.body.textResponse,req.body.token,req.body.idItem)
            if(hasResponseItem instanceof Error){
                res.json({error:hasResponseItem.message})
            }
            else{
                res.json({ok:'resposta enviada com sucesso'})
            }
        }
        else{
            res.json({error:'Informe os dados corretamente'})
        }
}

export const filterCard = async (req:Request,res:Response)=>{
      if(req.query.contentInput){
            const hasCards = await itemService.filterCard(req.query.contentInput as string)
            if(hasCards instanceof Error){
                res.status(400).json({error:hasCards.message})
            }
            else{
                res.status(200).json({cards:hasCards})
            }
      }
      else{
        res.status(400).json({error:'Informe o nome do item'})
      }
}

export const getUserLostItems = async(req:Request,res:Response) =>{
    if(req.params.userId){
        const hasLostItems = await itemService.listLostItem(req.params.userId)
        if(hasLostItems instanceof Error){
             res.status(400).json({error:hasLostItems.message})
        }
        else{
            res.status(200).json({lostItems:hasLostItems})
        }
    }else{
        res.status(400).json({error:'Informe o id do usuario'})
    }
}
export const listResponsesItemOfUser  = async(req:Request,res:Response) =>{
     if(req.params.itemId){
            const hasResponses = await itemService.listReponsesOfItem(req.params.itemId)
            if(hasResponses instanceof Error){
                res.status(400).json({error:hasResponses.message})
            }
            else{
                res.status(200).json({listResponses:hasResponses})
            }
     }
     else{
         return res.status(400).json({error:'Informe o id do item nos params'})
     }
}

export const sendMessage = async(req:Request,res:Response) =>{
     if(req.body.userId){
            const createMessage = await itemService.sendMessageUser(req.body.userId)
            if(createMessage instanceof Error){
                res.status(400).json({error:createMessage.message})
            }
            else{
                res.status(200).json({ok:createMessage})
            }
     }
     else{
        return res.status(400).json({error:'Informe o id do usuario'})
     }
}

export const getLocationsUser = async(req:Request,res:Response) =>{
    if(req.params.userId){
        const getLocations = await itemService.locationUser(req.params.userId)
        if(getLocations instanceof Error){
            res.status(400).json({error:getLocations.message})
        }
        else{
            res.status(200).json({ok:getLocations})
        }
    }
    else{
        res.status(400).json({error:'Error informe o id do usuario'})
    }
}

export const deleteItem = async(req:Request,res:Response)=>{
    const destroyedItem = await AdminService.deleteItem(req.params.id)
    if(destroyedItem instanceof Error){
           res.json({error:destroyedItem.message}).status(400)
    }
    else{
           res.json({ok:destroyedItem}).status(200)
    }
}