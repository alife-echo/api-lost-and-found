import express,{Request,Response} from 'express'
import * as itemService from '../services/ItemService'
import { ItemUploadData } from '../types/GlobalTypes';
import fs from 'fs'
import  Jwt  from 'jsonwebtoken';
import { Prisma } from '@prisma/client';

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