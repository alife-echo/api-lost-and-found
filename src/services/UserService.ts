import { PrismaClient,Prisma} from '@prisma/client';
import { generateRandomNumber } from "../helpers/generateRandomNumber";
import { UserCreateInput } from '../types/GlobalTypes';

import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export const createUser = async (name:string,email:string,password:string) => {
    const hasUser = await prisma.user.findUnique({where:{email}})
    let user : Prisma.UserCreateInput
    let id = 0
    if(!hasUser){
        const hash = bcrypt.hashSync(password,10)
            user = {
            id:id++,
            name:name,
            email:email,
            password: hash,
            code: generateRandomNumber(),} // Certifique-se de que essa função existe e retorna uma string.
          const newUser = await prisma.user.create({data:user})
          return newUser;
    }
    else{
        return new Error ('É-mail já existe')
    }
}
export const findByEmail = async (email:string) => {
      return await prisma.user.findUnique({where:{email}})
}
export const matchPassword = (passwordText:string,encrypted:string)=>{
    return bcrypt.compareSync(passwordText,encrypted)
}