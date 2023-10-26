import { PrismaClient,Prisma} from '@prisma/client';


const prisma = new PrismaClient()


export const getListItem = async () =>{ 
    const getListItems =  await prisma.item.findMany({})
    return  getListItem.length >= 0 ? getListItems : new Error('Não há items no momento')
}
export const deleteItem = async (id:string) => {
    if(id){
        const item = await prisma.item.delete({where:{id:id}})
        return 'Item deletado'
    }
    return 'Informe id item'
}