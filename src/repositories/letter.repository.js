import { prisma } from "../configs/db.config.js"

export const getLetterDetail = async (id) => {
    const letter = await prisma.letter.findFirst({
        select: {
            id: true,
            title: true,
            content: true,
            deliveredAt: true,
            question: {
                select: {
                    content: true
                }
            },
            design: {
                select: {
                    paper: {
                        select: {
                            id: true,
                            name: true,
                            paperAssetUrl: true
                        }
                    },
                    stamp: {
                        select: {
                            id: true,
                            name: true,
                            assetUrl: true
                        }
                    },
                    font: {
                        select: {
                            id: true,
                            name: true,
                            assetUrl: true   
                        }
                    }
                }
            }
        },
        where: {
            id: id
        }
    })
    
    if(!letter) return null;

    return {
        id: letter.id,
        title: letter.title,
        content: letter.title,
        deliveredAt: letter.deliveredAt,
        question: letter?.question.content,
        design: {
            paper: {
                id: letter?.design?.paper?.id,
                name: letter?.design?.paper?.name,
                assetUrl: letter?.design?.paper?.paperAssetUrl
            },
            stamp: {
                id: letter?.design?.stamp?.id,
                name: letter?.design?.stamp?.name,
                assetUrl: letter?.design?.stamp?.assetUrl
            },
            font: {
                id: letter?.design?.font?.id,
                name: letter?.design?.font?.name,
                assetUrl: letter?.design?.font?.assetUrl
            }
        }
    }
}

// senderUserId = receiverUserId, letterType, questionId, title, content, isPublic, status, scheduledAt 필수 deliveredAt, readAt은 scheduledAt에 따라서
export const createLetter = async ({letter, design}) => {
    await prisma.letter.create({
        data: {
            ...letter,
            design: {
                ...design
            }
        }
    });
}

export const getFriendLetters = async ({userId, friendId}) => {
    const letters = await prisma.letter.findMany({
        where: {
            OR:[
                { senderUserId: userId, receiverUserId: friendId },
                { senderUserId: friendId, receiverUserId: userId }
            ]
        },
        select: {
            id: true,
            title: true,
            deliveredAt: true,
            readAt: true,
            question: {
                select: {
                    content: true
                }
            },
            design: {
                select: {
                    paper: {
                        select: {
                            id: true,
                            name: true,
                            paperAssetUrl: true
                        }
                    },
                    stamp: {
                        select: {
                            id: true,
                            name: true,
                            assetUrl: true
                        }
                    },
                }
            }
        }
    })

    const question = letters[0]?.question?.content;

    return { 
        letters: letters.map(({ question, ...rest }) => rest), 
        question 
    };
}

export const getPublicLetters = async ({ids, userId, isFriendOnly = false, isDetail = false}) => {
    console.log(isFriendOnly);
    const letters = await prisma.letter.findMany({
        where: {
            senderUserId: isFriendOnly
                ? { in: ids }
                : { notIn: ids },
            isPublic: true
        },
        select: {
            id: true,
            title: true,
            content: isDetail ? true : false,
            _count: isDetail ? {select: { likes: true }} : false,
            likes: isDetail ? {
                where: {
                    userId: userId
                },
                select: {
                    letterId: true
                }
            } : false,
            deliveredAt: true,
            design: {
                select: {
                    paper: {
                        select: {
                            id: true,
                            name: true,
                            envelopeAssetUrl: true
                        }
                    },
                }
            }
        }
    })

    return letters.map(letter => ({ 
        id: letter?.id,
        title: letter?.title,
        deliveredAt: letter?.deliveredAt,
        ...(isDetail && {
            content: letter?.content,
            likes: letter?._count?.likes,
            isLiked: (letter?.likes?.length ?? 0) > 0,
        }),
        design: {
            paper: {
                id: letter?.design?.paper?.id,
                name: letter?.design?.paper?.name,
                assetUrl: letter?.design?.paper?.envelopeAssetUrl
            }
        }
    }));
}

export const countLetterStatsForWeek = async ({userId, weekStart, weekEnd}) => {
    const counts = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            _count: {
                select: {
                    sentLetters: {
                        where: { createdAt: { gte: weekStart, lte: weekEnd } }
                    },
                    receivedLetters: {
                        where: { createdAt: { gte: weekStart, lte: weekEnd } }
                    }
                }
            }
        }
    })
    
    return {
        "receivedCount": counts?._count?.receivedLetters ?? 0,
        "sentCount": counts?._count?.sentLetters ?? 0,
    }
}

export const countTotalSentLetter = async (userId) => {
    const totalCount = await prisma.letter.count({
        where: {
            senderUserId: userId
        }
    })

    return totalCount;
}