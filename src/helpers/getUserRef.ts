import JWT, { JwtPayload } from 'jsonwebtoken'
import { PrismaClient,Prisma} from '@prisma/client';
const prisma = new PrismaClient()
export const getUserRef = async (token:string,secretKey:string|undefined) => {
    const decodedToken = JWT.verify(token, secretKey as string) as JwtPayload;
    const userRef = await prisma.user.findUnique({ where: { email: decodedToken.email } });
    return {id : userRef?.id, name:userRef?.name,email:userRef?.email}
}