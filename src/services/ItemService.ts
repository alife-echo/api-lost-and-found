import { PrismaClient,Prisma} from '@prisma/client';
import dotenv from 'dotenv'
import { ItemUploadData } from '../types/GlobalTypes';
import { areAllPropertiesFilled } from '../helpers/validatedPropertiesUploadItem';
import { v4 as uuidv4 } from 'uuid';
import { getUserRef } from '../helpers/getUserRef';
dotenv.config()


const prisma = new PrismaClient()

export const uploadItem = async (item:ItemUploadData) => {
    if(areAllPropertiesFilled(item)){
        let itemStruct:Prisma.ItemCreateInput
        itemStruct = {
            id:uuidv4(),
            nameItem:item.name,
            littleDescription:item.littleDescription,
            questionsValidated:item.questionsValidated,
            meetingLocation:item.meetingLocation,
            image:item.image,
            user:{
                connect:{id:item.userId}
            }
        }
        const newItem = await prisma.item.create({data:itemStruct})
        return newItem;
    }
    else{
        return new Error('Error ao enviar item')
    }
}

export const getListItem = async (token:string) =>{
     const userRef =  getUserRef(token,process.env.JWT_SECRET_KEY)
     const getListItems =  await prisma.item.findMany({where:{
         userId:{
            not:{
                equals:(await userRef).id
            }
         }
     }})

     return getListItems
}