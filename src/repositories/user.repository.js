import { prisma } from "../configs/db.config.js";

export const findUserByEmail = async (email) => {
    try{
        const user = await prisma.user.findFirst({ 
            select: {
                auths: {
                    select: {
                        provider: true
                    }
                }
            },
            where: { 
                email: email,
            }
        });
        return {
            id: user.id,
            provider: user.auths[0].provider
        };
    } catch (err) {
        throw new Error(err);
    }
}

export const findUserById = async (payload) => {
    try{
        const user = await prisma.user.findFirst({ where: { id: payload.id, isDeleted: false }});
        return user;
    } catch (err) {
        throw new Error(err);
    }
}

export const createUserAndAuth = async ({user, auth}) => {
    
    try{
        const newUser = await prisma.user.create({ 
            data: {
                email: user.email,
                auths: {
                    create: {
                        email: user.email,
                        ...auth
                    }
                }  
            }
        });
        return newUser;
    } catch(err) {
        throw new Error(err);
    }
}