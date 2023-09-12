import { PrismaClient,Prisma} from '@prisma/client';
import dotenv from 'dotenv'
import { ItemUploadData } from '../types/GlobalTypes';
import { areAllPropertiesFilled } from '../helpers/validatedPropertiesUploadItem';
import { v4 as uuidv4 } from 'uuid';
import { getUserRef } from '../helpers/getUserRef';
import { getDateNow } from '../helpers/getDateNow';
import { getHoursAndMinutesNow } from '../helpers/getHoursAndMinutesNow';
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

export const getListItem = async (token:string) =>{ // listar itens na home
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
export const getItemID = async (id:string) => { // mostrar o item no forum
    const item = await prisma.item.findUnique({where:{id}})
    const getResponses = await prisma.itemResponse.findMany({where:{itemId:id}})
    if(item){
       return {item,getResponses}
    }
    else {
        return new Error('Error ao encontrar item ')
    }
}

export const sendReponseItem = async (txtResponse:string,token:string,idItem:string) =>{ // responder o item no forum
    const userRef = await getUserRef(token,process.env.JWT_SECRET_KEY)
    let responseItemStruct:Prisma.ItemResponseCreateInput
    responseItemStruct = {
        id:uuidv4(),
        textResponse:txtResponse,
        date:getDateNow(),
        time:getHoursAndMinutesNow(),
        user:{
            connect:{id:userRef.id}
        },
        item:{
            connect:{id:idItem}
        }
    }
    const newResponse =  await prisma.itemResponse.create({data:responseItemStruct})
    if(newResponse){
        return newResponse
    }
    else{
        return new Error('Error ao enviar resposta do item')
    }
}

export const filterCard = async (contentInput: string) => { // filtro de pesquisa
    if (contentInput) {
        try {
            const filteredItems = await prisma.item.findMany({
                where: {
                    nameItem: {
                        contains: contentInput
                    }
                }
            });
            return filteredItems;
        } catch (error) {
            return new Error('Erro ao buscar itens');
        }
    } else {
        return new Error('Informe o título do item');
    }
};

export const listLostItem = async(userId:string) => { // listar itens publicado do usuario
    if(userId){
        const lostItem = await prisma.item.findMany({where:{userId}})
        if(lostItem){
            return lostItem
        }
        else{
            return new Error('error ao listar items')
        }
    }     
    else{
        return new Error('error listagem,informe o id do usuario')
    }
}

export const listReponsesOfItem = async(itemId:string) =>{ // listar respostas daquele item
     if(itemId){
        const hasResponseItem = await prisma.itemResponse.findMany({where:{itemId}})
        const hasUserResponseItem = await prisma.user.findMany({where:{id:hasResponseItem[0].userId}})
        if(hasResponseItem && hasResponseItem){
            return {hasResponseItem,hasUserResponseItem}
        }
        else{
            return new Error('error ao listar respostas e usuarios do item')
        }
     }
     else{
        return new Error('Error, informe o id do item')
     }
}

export const  sendMessageUser = async(userId:string) =>{
    if(userId){
        const hasReponseItem = await prisma.itemResponse.findFirst({where:{userId}})
        const hasItem = await prisma.item.findFirst({where:{id:hasReponseItem?.itemId}})
        const hasUser = await prisma.user.findFirst({where:{id:hasReponseItem?.userId}})
        if(hasReponseItem && hasItem && hasUser){
            let messageStruct : Prisma.MessageCreateInput
            messageStruct = {
                id:uuidv4(),
                date:getDateNow(),
                time:getHoursAndMinutesNow(),
                meetingLocation:hasItem.meetingLocation,
                userSend:hasUser.name,
                user:{
                    connect:{id:hasReponseItem.userId}
                },
            }
            await prisma.$transaction([
                prisma.message.create({ data: messageStruct }),
                prisma.item.delete({ where: { id: hasItem.id } }),
            ]);

            return 'Mensagem enviada com sucesso.';
        }
        else{
            return new Error('Error ao encontrar os dados do item e usuario')
        }
    }else{
        return new Error('Error, informe o id do usuario')
    }
}