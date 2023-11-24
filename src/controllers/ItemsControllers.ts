import express,{Request,Response} from 'express'
import * as itemService from '../services/ItemService'
import { ItemUploadData } from '../types/GlobalTypes';
import * as AdminService from '../services/AdminService'
import {initializeApp} from 'firebase/app'
import {getStorage,ref,getDownloadURL,uploadBytesResumable} from 'firebase/storage'
import config from '../config/firebase.config'

import { getUserRef } from '../helpers/getUserRef';
import fs from 'fs'
import multer from 'multer';
import { getHoursAndMinutesNow } from '../helpers/getHoursAndMinutesNow';
import { getDateNow } from '../helpers/getDateNow';

initializeApp(config.firebaseConfig)

const storage = getStorage()


export const upload = async (req:Request,res:Response)=>{
    if(req.body.nameItem && req.body.littleDescription && req.body.questionsValidated && req.body.meetingLocation && req.file?.fieldname && req.body.idUser){
        
        try {
                const dateTime = `${getDateNow()} - ${getHoursAndMinutesNow()}` 
                const storageRef = ref(storage,`files/${req.file.originalname + "     " + dateTime}`)
                const metadata = {
                    contentType:req.file.mimetype
                }
                const snapshot = await uploadBytesResumable(storageRef,req.file.buffer,metadata)
                const downloadURL = await getDownloadURL(snapshot.ref)
                const itemData:ItemUploadData = {
                    name: req.body.nameItem,
                    littleDescription: req.body.littleDescription,
                    questionsValidated: req.body.questionsValidated,
                    meetingLocation: req.body.meetingLocation,
                    image: downloadURL, 
                    userId:req.body.idUser
                  };
                  
                const item = await itemService.uploadItem(itemData)
                if(item instanceof Error){
                    res.status(400).json({error:item.message})
                }
                
                else{
                    res.status(200).json({ok:'Upload realizado com sucesso'})
                }
          
            }
        catch(error){
            console.log(error)
            return res.status(400).json({error:'Error ao enviar imagem'})
        }        
       
    }
    else{
        res.json({error:'Informe os dados corretamente'})
    }
}

export const getListItems = async (req:Request,res:Response) =>{
     const token:string = req.query.token as string
     if(!token){
        res.status(400).json({error:'Token não existe'})
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
        res.status(400).json({error:'Não existem item'})
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
                res.status(400).json({error:hasResponseItem.message})
            }
            else{
                res.status(200).json({ok:'resposta enviada com sucesso'})
            }
        }
        else{
            res.status(400).json({error:'Informe os dados corretamente'})
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
     if(req.body.userId && req.body.itemId){
            const createMessage = await itemService.sendMessageUser(req.body.userId,req.body.itemId)
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