import { prisma } from "../configs/db.config.js";

export const findUserByEmail = async (email) => {
    try{
        const user = await prisma.user.findFirst({ where: { email: email }});
        return user;
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

export const createUser = async (email) => {
    try{
        const user = await prisma.user.create({ data: { email: email } });
        return user;
    } catch(err) {
        throw new Error(err);
    }
}