import { prisma } from "../configs/db.config.js";

export const findLetterAssets = async () => {
    const [papers, fonts, stamps] = await prisma.$transaction([
        prisma.letterAssetPaper.findMany({ select: { id: true, name: true, paperAssetUrl: true }, where: { isActive : true }}),
        prisma.letterAssetFont.findMany({ select: { id: true, name: true, assetUrl: true }, where: { isActive : true }}),
        prisma.letterAssetStamp.findMany({ select: { id: true, name: true, assetUrl: true }, where: { isActive : true }})
    ])
    console.log(papers)
    return { papers, fonts, stamps };
}