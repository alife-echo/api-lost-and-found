import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';

import dotenv from 'dotenv';
import { getUserRef } from '../helpers/getUserRef';

dotenv.config();

export const Auth = {
    private: async (req: Request, res: Response, next: NextFunction) => {
        let success = false;

        if (req.headers.authorization) {
            const [authType, token] = req.headers.authorization.split(' ');
            if (authType === 'Bearer') {
                try {
                    JWT.verify(
                        token,
                        process.env.JWT_SECRET_KEY as string
                    );
                        success = true;
                    
                } catch (err) {
                }
            }
        }

        if (success) {
            next();
        } else {
            res.status(403);
            res.json({ error: 'Não autorizado' });
        }
    },

    admin: async (req: Request, res: Response, next: NextFunction) => {
        if (req.headers.authorization) {
            const [authType, token] = req.headers.authorization.split(' ');
            if (authType === 'Bearer') {
                try {
                    JWT.verify(
                        token,
                        process.env.JWT_SECRET_KEY as string
                    );
                    const userRef = await getUserRef(token, process.env.JWT_SECRET_KEY)
                    if (userRef instanceof Error) {
                        return userRef;
                      }
                    if (userRef.email === 'alife.silva@unifesspa.edu.br' || userRef.email === 'gabriel.britos@unifesspa.edu.br') {
                        next();
                        return;
                    }
                } catch (err) {
                }
            }
        }

        res.status(403);
        res.json({ error: 'Não autorizado' });
    }
}
