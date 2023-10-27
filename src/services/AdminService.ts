import { PrismaClient,Prisma} from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';


const prisma = new PrismaClient()


export const getListItem = async () =>{ 
    return  ((await prisma.item.findMany({})).length >= 0 ? await prisma.item.findMany({}) : new Error('Não há items no momento'))
}


export const deleteItem = async (id: string) => {
    if (!id) {
        return new Error('Informe um ID');
    }

    const itemToDelete = await prisma.item.findUnique({ where: { id } });

    if (!itemToDelete) {
        return new Error('Item não encontrado');
    }

    await prisma.item.delete({ where: { id } });
    return 'Item deletado';
}





export const infoUser = async (id:string) => {
    if (!id) {
        return new Error('Informe um ID');
    }
     else{
        return await prisma.user.findUnique({where:{id}}) ?  await prisma.user.findUnique({where:{id}}) : new Error('Erro ao encontrar usuário')
     }
}




export const deleteUser = async (userId:string)=>{
    if (!userId) {
        return new Error('Informe id usuário');
    }
    const findUser = await prisma.user.findUnique({ where: { id:userId } });

    if (!findUser) {
        return new Error('Usuário não encontrado');
    }
    let StructBanned : Prisma.UserBannedCreateInput
            StructBanned = {
                id:uuidv4(),
                email:findUser.email
            }

    await prisma.$transaction([
        prisma.userBanned.create({data:StructBanned}),
        prisma.user.delete({ where: { id: userId } }),
    ]);

    return 'Usuário banido com sucesso'
}

export const findByEmailBanned = async (email:string) => {
        return await prisma.userBanned.findUnique({where:{email}}) ? false : true
}