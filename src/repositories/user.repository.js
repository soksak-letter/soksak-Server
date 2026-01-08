import { prisma } from "../configs/db.config.js";

export const findUserByEmail = async (email) => {
    try{
        const user = await prisma.user.findFirst({ 
            select: {
                id: true,
                email: true,
                createdAt: true,
                auths: {
                    select: {
                        provider: true,
                        username: true
                    }
                }
            },
            where: { 
                email: email,
            }
        });

        if(!user) return null;
        
        return {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            provider: user.auths?.[0]?.provider,
            username: user.auths?.[0]?.username
        };
    } catch (err) {
        throw new Error(err);
    }
}

export const findUserById = async (payload) => {
    try{
        const user = await prisma.user.findFirst({ 
            where: { 
                id: payload.id, 
                isDeleted: false 
            },
            select: {
                id: true,
                email: true,
                auths: {
                    select: {
                        provider: true,
                        username: true
                    }
                }
            }
        });

        if(!user) return null;

        return {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            provider: user.auths?.[0]?.provider,
            username: user.auths?.[0]?.username
        };
    } catch (err) {
        throw new Error(err);
    }
}

export const findUserByUsername = async (username) => {
    try{
        const user = await prisma.user.findFirst({
            where: { 
                auths: { 
                    some: { 
                        username: username 
                    } 
                } 
            },
            select: {
                id: true,
                email: true,
                auths: {
                    select: {
                        provider: true,
                        username: true
                    }
                }
            }
        });
        
        if(!user) return null;

        return {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            provider: user.auths?.[0]?.provider,
            username: user.auths?.[0]?.username
        };
    } catch (err) {
        throw new Error(err);
    }
}

export const createUserAndAuth = async ({user, auth}, tx = prisma) => {
    try{
        const newUser = await tx.user.create({ 
            data: {
                email: user.email,
                name: user.name,
                phoneNumber: user.phoneNumber,
                auths: {
                    create: {
                        username: user.username,
                        email: user.email,
                        ...auth
                    }
                }  
            },
            select: {
                id: true,
                email: true,
                auths: {
                    select: {
                        provider: true
                    }
                }
            }
        });

        return {
            id: newUser.id,
            email: newUser.email,
            provider: newUser.auths?.[0]?.provider
        };
    } catch(err) {
        throw new Error(err);
    }
}

export const createUserAgreement = async (data, tx = prisma) => {
    try{
        await tx.userAgreement.create({
            data: data
        });
    } catch(err) {
        throw new Error(err);
    }
}

export const softDeleteUser = async (id) => {
    try{
        await prisma.user.update({
            data: {
                isDeleted: true,
                deletedAt: new Date()
            },
            where: { id: id }
        })
    } catch(err) {
        if(err.code === 'P2025') {
            throw new Error("존재하지 않는 유저입니다.");   // 이런 에러처리는 MVP까지 한 뒤에 적용
        }
        throw new Error(err);
    }
}