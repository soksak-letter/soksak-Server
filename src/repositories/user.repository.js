import { prisma } from "../configs/db.config.js";
import { xprisma } from "../xprisma.js";
import { DuplicatedValueError } from "../errors/base.error.js";
import { UserNotFoundError, StoragePermissionError, StorageNotFoundError, StorageUploadError } from "../errors/user.error.js";
import { SessionNotFoundError, SessionFullError } from "../errors/session.error.js";
import { getObjectStorageClient } from "../configs/objectStorage.config.js";
import { requiredEnv } from "../utils/user.util.js";

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
            throw new UserNotFoundError("USER_NOT_FOUND", "해당 정보로 가입된 계정을 찾을 수 없습니다.", "email");
        }
        throw new Error(err);
    }
}

export const findRandomUserByPool = async (id) => {
  const poolRaw = await prisma.user.findFirst({
    where: { id },
    select: { pool: true },
  });

  const sessions = await prisma.matchingSession.findMany({
    where: {
      status: { in: ["PENDING", "CHATING"] },
      participants: { some: { userId: id } },
    },
    select: {
      participants: {
        where: { userId: { not: id } },
        select: { userId: true },
      },
    },
  });

  const sessionOtherUserIds = sessions.flatMap((s) =>
    s.participants.map((p) => p.userId)
  );

  const friendIdsRaw = await prisma.friend.findMany({
    where: { OR: [{ userAId: id }, { userBId: id }] },
    select: { userAId: true, userBId: true },
  });

  const friendIds = friendIdsRaw
    .map((r) => (r.userAId === id ? r.userBId : r.userAId))
    .filter((x) => x != null);

  const excludeIds = [...new Set([id, ...friendIds, ...sessionOtherUserIds])];

  const pool = poolRaw?.pool;

  const rows = await xprisma.user.findMany({
    where: {
      blockerUserId: id,
      pool,
      id: { notIn: excludeIds },
    },
    select: { id: true },
  });

  const candidateIds = rows.map((r) => r.id);
  if (candidateIds.length === 0) return null;
    
  const counts = await prisma.sessionParticipant.groupBy({
    by: ["userId"],
    where: {
      userId: { in: candidateIds },
      session: { status: "CHATING" }, 
    },
    _count: { sessionId: true },
  });

  const countMap = new Map(counts.map((r) => [r.userId, r._count.sessionId]));

  const availableIds = candidateIds.filter(
    (uid) => (countMap.get(uid) ?? 0) <= 10
  );

  if (availableIds.length === 0) {
    throw new SessionFullError();
  }

  const randomId = availableIds[Math.floor(Math.random() * availableIds.length)];

  const pickedCount = countMap.get(randomId) ?? 0;
  if (pickedCount > 10) {
    throw new SessionNotFoundError(undefined, undefined, randomId);
  }

  return randomId;
};


// ========== Consent Repository ==========
export const findUserAgreementByUserId = async (userId) => {
  return prisma.userAgreement.findUnique({
    where: { userId },
    select: {
      termsAgreed: true,
      privacyAgreed: true,
      ageOver14Agreed: true,
      marketingPushAgreed: true,
      marketingEmailAgreed: true
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
      termsAgreed: data.termsAgreed,
      privacyAgreed: data.privacyAgreed,
      ageOver14Agreed: data.ageOver14Agreed,
      marketingPushAgreed: data.marketingPushAgreed,
      marketingEmailAgreed: data.marketingEmailAgreed,
      agreedAt: new Date(),
    },
    select: {
      termsAgreed: true,
      privacyAgreed: true,
      ageOver14Agreed: true,
      marketingPushAgreed: true,
      marketingEmailAgreed: true,
    },
  });
};

// ========== PushSubscription Repository ==========
export const upsertPushSubscription = async ({ userId, endpoint, p256dh, auth }) => {
  // endpoint가 @unique라서 where에 endpoint 사용 가능
  // 같은 endpoint가 다른 userId에 있으면 업데이트, 없으면 생성
  return prisma.pushSubscription.upsert({
    where: { endpoint },
    update: {
      userId,
      p256dh,
      auth,
    },
    create: {
      userId,
      endpoint,
      p256dh,
      auth,
    },
    select: { id: true, userId: true, endpoint: true },
  });
};

export const getPushSubscription = async (userId) => {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { 
      userId: userId,
      user: {
        notificationSetting: {
          letterEnabled: true
        }
      }
    }
  })

  return subscriptions;
}

export const getPushSubscriptionForMarketing = async (userId) => {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { 
      userId: userId,
      user: {
        notificationSetting: {
          marketingEnabled: true
        }
      }
    }
  })

  return subscriptions;
}

export const deletePushSubscription = async (id) => {
  await prisma.pushSubscription.delete({
    where: {id: id}
  });
}

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
 * - 세션 상태가 "PENDING" 또는 "CHATING"인 세션의 편지만 조회
 * - senderUserId가 해당 세션의 참가자인지 확인
 */
export const findReceivedLettersForThreads = async ({ userId, letterType }) => {
  // 먼저 세션 상태가 PENDING 또는 CHATING인 세션들을 조회
  // receiver(userId)가 참가자인 세션만 조회
  const validSessions = await prisma.matchingSession.findMany({
    where: {
      status: { in: ["PENDING", "CHATING"] },
      participants: {
        some: {
          userId: userId // receiver가 참가자인 세션
        }
      }
    },
    select: {
      id: true,
      participants: {
        select: {
          userId: true
        }
      }
    }
  });

  // 유효한 세션이 없으면 빈 배열 반환
  if (validSessions.length === 0) {
    return [];
  }

  const validSessionIds = new Set(validSessions.map(s => s.id));
  const sessionParticipantMap = new Map();
  validSessions.forEach(session => {
    sessionParticipantMap.set(session.id, new Set(session.participants.map(p => p.userId)));
  });

  // 해당 세션에 연결된 편지들을 조회
  const letters = await prisma.letter.findMany({
    where: {
      receiverUserId: userId,
      letterType,
      sessionId: { in: Array.from(validSessionIds) },
    },
    orderBy: [{ deliveredAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      senderUserId: true,
      title: true,
      content: true,
      deliveredAt: true,
      createdAt: true,
      sessionId: true,
      design: {
        select: {
          paper: {
            select: {
              id: true,
              color: true,
            }
          },
          stamp: {
            select: {
              id: true,
              name: true,
              assetUrl: true,
            }
          },
        },
      },
    },
  });

  // senderUserId가 세션 참가자인지 확인하여 필터링
  return letters.filter(letter => {
    if (!letter.sessionId || !letter.senderUserId) return false;
    const participantUserIds = sessionParticipantMap.get(letter.sessionId);
    return participantUserIds && participantUserIds.has(letter.senderUserId);
  });
};

/**
 * 특정 익명 스레드(=senderUserId)의 편지 목록 (받은 편지)
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
      readAt: true,
      createdAt: true,
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
              color: true,
            }
          },
          stamp: {
            select: {
              id: true,
              name: true,
              assetUrl: true
            }
          },
        },
      },
    },
  });
};

/**
 * 특정 익명 스레드(=receiverUserId)의 편지 목록 (보낸 편지)
 */
export const findSentLettersByReceiver = async ({ userId, receiverUserId, letterType }) => {
  return prisma.letter.findMany({
    where: {
      senderUserId: userId,
      receiverUserId,
      letterType,
    },
    orderBy: [{ deliveredAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      content: true,
      deliveredAt: true,
      readAt: true,
      createdAt: true,
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
              color: true,
            }
          },
          stamp: {
            select: {
              id: true,
              name: true,
              assetUrl: true
            }
          },
        },
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
      questionId: true,
      design: {
        select: { 
          paperId: true,
          stampId: true,
          stamp: {
            select: {
              assetUrl: true
            }
          }
        },
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

export const findUserNicknameById = async(id) => {
  return await prisma.user.findFirst({
    where: {
      id,
    },
    select: {
      nickname: true,
    }
  })
}

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

export const findRecentNotices = async (minutes = 10) => {
  const now = new Date();
  const minutesAgo = new Date(now.getTime() - minutes * 60 * 1000);

  return prisma.notice.findMany({
    where: {
      createdAt: {
        gte: minutesAgo,
        lte: now,
      },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
  });
};

export const findUsersWithMarketingPushEnabled = async () => {
  const users = await prisma.user.findMany({
    where: {
      isDeleted: false,
      notificationSetting: {
        marketingEnabled: true,
      },
      pushSubscriptions: {
        some: {},
      },
    },
    select: {
      id: true,
    },
  });

  return users.map((user) => user.id);
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

//  이용시간(분): 실제 웹사이트 사용 시간 (totalUsageMinutes 필드 사용)
export const getTotalUsageMinutes = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      totalUsageMinutes: true,
    },
  });

  return user?.totalUsageMinutes ?? 0;
};

export const updateUserNicknameById = async ({ userId, nickname }) => {
  return prisma.user.update({
    where: { id: userId },
    data: { nickname },
    select: { id: true },
  });
};

export const updateUserPoolById = async ({id, pool}) => {
  await prisma.user.updateMany({
    where: { id },
    data: { pool },
  });
}

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

export const incrementTotalUsageMinutes = async (userId) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      totalUsageMinutes: {
        increment: 1,
      },
    },
    select: {
      id: true,
      totalUsageMinutes: true,
    },
  });
};

// ========== Object Storage Repository ==========
export const uploadProfileImageToStorage = async ({ objectName, fileBuffer, contentType }) => {
  const namespaceName = requiredEnv("OCI_NAMESPACE");
  const bucketName = requiredEnv("OCI_BUCKET_NAME");
  const regionId = requiredEnv("OCI_REGION");

  const client = getObjectStorageClient();

  try {
    await client.putObject({
      namespaceName,
      bucketName,
      objectName,
      contentType,
      contentLength: fileBuffer.length,
      putObjectBody: fileBuffer,
    });
  } catch (error) {
    // OCI API 에러 분류
    if (error.statusCode === 401 || error.statusCode === 403) {
      throw new StoragePermissionError("USER_STORAGE_PERMISSION_DENIED", `Object Storage 접근 권한이 없습니다. (인증 실패 또는 Bucket/Namespace 접근 권한 없음): ${error.message}`, { statusCode: error.statusCode, originalError: error.message });
    }
    if (error.statusCode === 404) {
      throw new StorageNotFoundError("USER_STORAGE_NOT_FOUND", `Object Storage 리소스를 찾을 수 없습니다. (Namespace, Bucket 또는 Object 경로 오류): ${error.message}`, { statusCode: error.statusCode, originalError: error.message });
    }
    // 네트워크 오류, 타임아웃, 서버 오류 등
    throw new StorageUploadError("USER_STORAGE_UPLOAD_FAILED", `파일 업로드 중 오류가 발생했습니다. (네트워크 오류, 타임아웃 또는 서버 오류): ${error.message}`, { statusCode: error.statusCode || null, originalError: error.message });
  }

  const publicUrl =
    `https://objectstorage.${regionId}.oraclecloud.com` +
    `/n/${namespaceName}/b/${bucketName}/o/${encodeURIComponent(objectName)}`;

  return { objectName, publicUrl };
};
