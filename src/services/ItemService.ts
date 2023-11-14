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
     const userRef = await getUserRef(token,process.env.JWT_SECRET_KEY)
     if(!userRef){
        return new Error('Usuário não encontrado')
     }
     if (userRef instanceof Error) {
        return userRef;
      }
     const getListItems =  await prisma.item.findMany({where:{
         userId:{
            /*
            not:{
                equals:userRef.id || ''
            }*/
         }
     }})

     return getListItems
}
export const getItemID = async (id:string) => { // mostrar o item no forum
    const item = await prisma.item.findUnique({where:{id}})
    const getResponses = await prisma.itemResponse.findMany({where:{itemId:id}})
    if(!item){
       return new Error('Error ao encontrar item ')
    }
    else {
        return {item,getResponses}
    }
}

export const sendReponseItem = async (txtResponse:string,token:string,idItem:string) =>{ // responder o item no forum
    const userRef = await getUserRef(token,process.env.JWT_SECRET_KEY)
    const item = await prisma.item.findUnique({where:{id:idItem}})
    if(!item){
        return new Error('Error ao encontrar item')
     }
    if (userRef instanceof Error) {
        return userRef;
      }
    let responseItemStruct:Prisma.ItemResponseCreateInput
    responseItemStruct = {
        id:uuidv4(),
        textResponse:txtResponse,
        date:getDateNow(),
        time:getHoursAndMinutesNow(),
        useRes:userRef.name || '',
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
        if(!hasResponseItem || hasResponseItem.length<=0){
                return new Error('Error ao listar respostas e usuarios do item')
        }
        const hasUserResponseItem = await prisma.user.findMany({where: {id: hasResponseItem[0].userId},select: {email: true,name: true}})
        if(hasResponseItem && hasResponseItem){
            return {hasResponseItem,hasUserResponseItem}
        }
     }
     else{
        return new Error('Error, informe o id do item')
     }
}

export const  sendMessageUser = async(userId:string,itemId:string) =>{ // mandar a mensagem para o usuario
    if(userId && itemId){
        const hasReponseItem = await prisma.itemResponse.findFirst({where:{userId,itemId}})
        const item = await prisma.item.findFirst({ where: { id: hasReponseItem?.itemId } })
        const user = await  prisma.user.findFirst({ where: { id: item?.userId} })
        
        if(hasReponseItem && item && user){
            let messageStruct : Prisma.MessageCreateInput
            messageStruct = {
                id:uuidv4(),
                date:getDateNow(),
                time:getHoursAndMinutesNow(),
                meetingLocation:item.meetingLocation || '',
                userSend:user.name || '',
                user:{
                    connect:{id:hasReponseItem?.userId}
                },
            }
            await prisma.$transaction([
                prisma.message.create({ data: messageStruct }),
                prisma.item.delete({ where: { id: item.id } }),
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

export const locationUser = async(userId:string)=>{ //mostrar as mensagens de localização para o usuario
    if(userId){
        const hasMessageUser = await prisma.message.findMany({where:{
            userId:userId
       }})
       if(hasMessageUser.length > 0){
            return hasMessageUser
       }
       else{
           return new Error('Error ao encontrar mensagens do usuario')
       }
    }
    else{
       return new Error('Error infome o id do usuario')   
    }
}

