import { prisma } from "../configs/db.config.js";
import { xprisma } from "../xprisma.js";
import { DuplicatedValueError } from "../errors/base.error.js";

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

export const findUserById = async (id) => {
    try{
        const user = await prisma.user.findFirst({ 
            where: { 
                id: id, 
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
        if(err.code === "P2002"){
            const target = err.meta?.target || "";

            if(target.includes("phone_number")){
                throw new DuplicatedValueError("USER_409_03", "이미 사용 중인 전화번호입니다.", "phoneNumber");
            }
        }
        throw err;
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

export const findRandomUserByPool = async (id) => {
  const poolRaw = await prisma.user.findFirst({
    where: {
        id
    },
    select: {
        pool: true
    }
  })
  const pool = poolRaw?.pool;
  const rows = await xprisma.user.findMany({
    where: {
        blockerUserId: id,
        pool,
        id: { not: id }
    },
    select: {
        id: true
    }
  })
  const length = rows.length;
  const randomNum = Math.floor(Math.random() * length);
  return rows[randomNum]?.id ?? null;
};


// ========== Consent Repository ==========
export const findUserAgreementByUserId = async (userId) => {
  return prisma.userAgreement.findUnique({
    where: { userId },
    select: {
      termsAgreed: true,
      privacyAgreed: true,
      marketingAgreed: true,
      ageOver14Agreed: true,
    },
  });
};

export const upsertUserAgreement = async ({ userId, data }) => {
  return prisma.userAgreement.upsert({
    where: { userId }, 
    update: {
      ...data,
      agreedAt: new Date(),
    },
    create: {
      userId,
      // 없으면 기본 false로 생성
      termsAgreed: data.termsAgreed ?? false,
      privacyAgreed: data.privacyAgreed ?? false,
      marketingAgreed: data.marketingAgreed ?? false,
      ageOver14Agreed: data.ageOver14Agreed ?? false,
      agreedAt: new Date(),
    },
    select: {
      termsAgreed: true,
      privacyAgreed: true,
      marketingAgreed: true,
      ageOver14Agreed: true,
    },
  });
};

// ========== DeviceToken Repository ==========
export const upsertUserDeviceToken = async ({ userId, deviceToken, deviceType = "FCM" }) => {
  // userId가 @unique라서 where에 userId 사용 가능
  return prisma.userDeviceToken.upsert({
    where: { userId },
    update: {
      deviceToken,
      deviceType,
      lastSeenAt: new Date(),
    },
    create: {
      userId,
      deviceToken,
      deviceType,
      lastSeenAt: new Date(),
    },
    select: { id: true, userId: true },
  });
};

// ========== Interest Repository ==========
export const findActiveInterests = async () => {
  return prisma.interest.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { id: "asc" },
  });
};

export const findMyActiveInterests = async (userId) => {
    return prisma.userInterest.findMany({
      where: {
        userId,
        interest: { isActive: true },
      },
      select: {
        interest: { select: { id: true, name: true } },
      },
      orderBy: { interestId: "asc" },
    }).then((rows) => rows.map((r) => r.interest));
  };

export const findActiveInterestsByIds = async (interestIds) => {
  return prisma.interest.findMany({
    where: {
      id: { in: interestIds },
      isActive: true,
    },
    select: { id: true },
  });
};

export const replaceUserInterests = async ({ userId, interestIds }) => {
  return prisma.$transaction(async (tx) => {
    await tx.userInterest.deleteMany({
      where: { userId },
    });

    // interestIds가 빈 배열이면 createMany를 스킵
    if (interestIds.length > 0) {
      await tx.userInterest.createMany({
        data: interestIds.map((interestId) => ({
          userId,
          interestId,
        })),
      });
    }

    return true;
  });
};

// ========== Mailbox Repository ==========
/**
 * 익명 스레드 목록용:
 * - receiverUserId = me
 * - letterType = ANON_SESSION
 * - senderUserId별 최신 편지 1개씩 뽑기 위해, 일단 최신순 전체를 가져오고 service에서 group 처리
 */
export const findReceivedLettersForThreads = async ({ userId, letterType }) => {
  return prisma.letter.findMany({
    where: {
      receiverUserId: userId,
      letterType,
    },
    orderBy: [{ deliveredAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      senderUserId: true,
      title: true,
      content: true,
      deliveredAt: true,
      createdAt: true,
      design: {
        select: { paperId: true }, // 편지통 색상용
      },
    },
  });
};

/**
 * 특정 익명 스레드(=senderUserId)의 편지 목록
 */
export const findReceivedLettersBySender = async ({ userId, senderUserId, letterType }) => {
  return prisma.letter.findMany({
    where: {
      receiverUserId: userId,
      senderUserId,
      letterType,
    },
    orderBy: [{ deliveredAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      content: true,
      deliveredAt: true,
      createdAt: true,
      design: {
        select: { paperId: true, stampId: true, fontId: true },
      },
    },
  });
};

/**
 * 나에게(SELF) 목록:
 * - senderUserId = me
 * - letterType = SELF
 */
export const findSelfLetters = async ({ userId, letterType }) => {
  return prisma.letter.findMany({
    where: {
      senderUserId: userId,
      letterType,
    },
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      deliveredAt: true,
      design: {
        select: { paperId: true },
      },
    },
  });
};

export const findUsersNicknameByIds = async (userIds) => {
  const rows = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, nickname: true },
  });

  const map = new Map();
  for (const r of rows) map.set(r.id, r.nickname ?? null);
  return map;
};

// ========== Notice Repository ==========
export const findActiveNotices = async () => {

  return prisma.notice.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      summary: true,
      pinned: true,
      createdAt: true,
    },
  });
};

export const findNoticeById = async (id) => {
  return prisma.notice.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      pinned: true,
      createdAt: true,
    },
  });
};

// ========== Notification Repository ==========
/**
 * 알림 설정 조회
 */
export const findNotificationSettingByUserId = async (userId) => {
  return prisma.userNotificationSetting.findUnique({
    where: { userId },
    select: {
      userId: true,
      letterEnabled: true,
      marketingEnabled: true,
      updatedAt: true,
    },
  });
};

/**
 * 알림 설정 생성 (기본값은 Prisma schema default를 따름)
 */
export const createNotificationSetting = async ({ userId, letterEnabled, marketingEnabled }) => {
  return prisma.userNotificationSetting.create({
    data: {
      userId,
      // 값이 undefined면 DB default 사용
      ...(typeof letterEnabled === "boolean" ? { letterEnabled } : {}),
      ...(typeof marketingEnabled === "boolean" ? { marketingEnabled } : {}),
    },
    select: { userId: true },
  });
};

/**
 * 알림 설정 업데이트
 */
export const updateNotificationSetting = async ({ userId, letterEnabled, marketingEnabled }) => {
  return prisma.userNotificationSetting.update({
    where: { userId },
    data: {
      ...(typeof letterEnabled === "boolean" ? { letterEnabled } : {}),
      ...(typeof marketingEnabled === "boolean" ? { marketingEnabled } : {}),
    },
    select: { userId: true },
  });
};

/**
 * upsert (없으면 생성)
 */
export const upsertNotificationSetting = async ({ userId, letterEnabled, marketingEnabled }) => {
  return prisma.userNotificationSetting.upsert({
    where: { userId },
    update: {
      ...(typeof letterEnabled === "boolean" ? { letterEnabled } : {}),
      ...(typeof marketingEnabled === "boolean" ? { marketingEnabled } : {}),
    },
    create: {
      userId,
      ...(typeof letterEnabled === "boolean" ? { letterEnabled } : {}),
      ...(typeof marketingEnabled === "boolean" ? { marketingEnabled } : {}),
    },
    select: { userId: true },
  });
};

// 알람 설정 조회 (없으면 기본값으로 생성)
export const findOrCreateNotificationSetting = async ({ userId }) => {
  // 없으면 기본값(Prisma default)으로 생성
  return prisma.userNotificationSetting.upsert({
    where: { userId },
    update: {}, // 조회 목적이라 update 없음
    create: { userId },
    select: {
      userId: true,
      letterEnabled: true,
      marketingEnabled: true,
      updatedAt: true,
    },
  });
};

// ========== Policy Repository ==========
export const findPolicyDocumentByKey = async (key) => {
  return prisma.policyDocument.findUnique({
    where: { key },
    select: {
      key: true,
      content: true,
      version: true,
      effectiveAt: true,
      updatedAt: true,
    },
  });
};

// ========== Profile Repository ==========
export const findUserByIdForProfile = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nickname: true,
      email: true,
      profileImageUrl: true,
    },
  });
};

export const findUserInterestsByUserId = async (userId) => {
  const rows = await prisma.userInterest.findMany({
    where: { userId },
    select: {
      interest: {
        select: { id: true, name: true },
      },
    },
    orderBy: { interestId: "asc" },
  });

  return rows.map((r) => r.interest);
};

export const countSentLetters = async (userId) => {
  return prisma.letter.count({
    where: { senderUserId: userId },
  });
};

export const countReceivedLetters = async (userId) => {
  return prisma.letter.count({
    where: { receiverUserId: userId },
  });
};

//  온도: session_review.temperature_score 평균(타겟 유저 기준)
export const getAverageTemperatureScore = async (userId) => {
  const result = await prisma.sessionReview.aggregate({
    where: { targetUserId: userId },
    _avg: { temperatureScore: true },
  });

  return result?._avg?.temperatureScore ?? null;
};

//  이용시간(분): matching_session started_at~ended_at 합 (참여한 세션 기준)
export const getTotalUsageMinutes = async (userId) => {
  const participants = await prisma.sessionParticipant.findMany({
    where: { userId },
    select: {
      session: {
        select: { startedAt: true, endedAt: true },
      },
    },
  });

  let totalMs = 0;
  for (const p of participants) {
    const startedAt = p?.session?.startedAt;
    const endedAt = p?.session?.endedAt;
    if (!startedAt || !endedAt) continue;

    const diff = new Date(endedAt).getTime() - new Date(startedAt).getTime();
    if (diff > 0) totalMs += diff;
  }

  return Math.floor(totalMs / 1000 / 60);
};

export const updateUserNicknameById = async ({ userId, nickname }) => {
  return prisma.user.update({
    where: { id: userId },
    data: { nickname },
    select: { id: true },
  });
};

export const updateUserProfileImageUrlById = async ({ userId, profileImageUrl }) => {
  return prisma.user.update({
    where: { id: userId },
    data: { profileImageUrl },
    select: { id: true },
  });
};

// ========== Onboarding Repository ==========
export const getUserForOnboarding = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, gender: true, job: true },
  });
};

export const updateUserOnboardingStep1 = async ({ userId, gender, job }) => {
  return prisma.user.update({
    where: { id: userId },
    data: { gender, job },
  });
};