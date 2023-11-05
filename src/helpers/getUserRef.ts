import JWT, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserRef = async (token: string, secretKey: string | undefined) => {
  try {
    const decodedToken = JWT.verify(token, secretKey as string) as JwtPayload;
    const userRef = await prisma.user.findUnique({ where: { email: decodedToken.email } });
    return { id: userRef?.id, name: userRef?.name, email: userRef?.email };
  } catch (error) {
    return new Error('Erro ao obter referência do usuário')
  }
};