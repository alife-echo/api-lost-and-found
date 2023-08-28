import { PrismaClient,Prisma} from '@prisma/client';
import { generateRandomNumber } from "../helpers/generateRandomNumber";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
dotenv.config()


const prisma = new PrismaClient()

export const createUser = async (name:string,email:string,password:string) => {
    let user : Prisma.UserCreateInput
        const hash = bcrypt.hashSync(password,10)
            user = {
            id:uuidv4(),
            name:name,
            email:email,
            password: hash,
            code: generateRandomNumber(),} 
          const newUser = await prisma.user.create({data:user})
          return newUser;
    }

export const findByEmail = async (email:string) => {
      return await prisma.user.findUnique({where:{email}})
}
export const matchPassword = (passwordText:string,encrypted:string)=>{
    return bcrypt.compareSync(passwordText,encrypted)
}
export const validatedCode = async(code:string) =>{
     const user =  await prisma.user.findUnique({where:{code}})
     if (user) {
        await prisma.user.update({
            where: { id: user.id },
            data: { validated: 1 }
        });
       
    } else {
        return new Error ('Código não existe')
    }
}