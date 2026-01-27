import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient();

async function main() {
  console.log('상세 시드 데이터 생성을 시작합니다...');

  // --- 1. 마스터 데이터: 관심사 (17개) ---
  const interestNames = ['공부', '음악', '영화', '돈', '사랑', '인간관계', '건강', '독서', '직장', '취업', '학교', '다이어트', '감정', '취미', '여행', '가족', '미용'];
  await prisma.interest.createMany({
    data: interestNames.map(name => ({ name, isActive: true })),
  });
  const allInterests = await prisma.interest.findMany();

  // --- 2. 마스터 데이터: 질문 (20개) ---
  for (let i = 1; i <= 20; i++) {
    await prisma.question.create({
      data: {
        content: `질문 #${i}: 당신의 오늘 하루 중 가장 행복했던 순간은 언제인가요?`,
        isActive: true,
        dailyQuestions: {
          create: { day: new Date(Date.now() + i * 24 * 60 * 60 * 1000) }
        }
      }
    });
  }
  const allQuestions = await prisma.question.findMany();

  // --- 3. 마스터 데이터: 에셋 각 10개씩 생성 (참조용) ---
  const papers = [];
  for (let i = 1; i <= 10; i++) {
    const p = await prisma.letterAssetPaper.create({
      data: { color: `Color_${i}`, assetUrl: `paper_url_${i}`, isActive: true }
    });
    papers.push(p);
  }

  const stamps = [];
  for (let i = 1; i <= 10; i++) {
    const s = await prisma.letterAssetStamp.create({
      data: { name: `우표_${i}`, assetUrl: `stamp_url_${i}`, isActive: true }
    });
    stamps.push(s);
  }

  const fonts = [];
  for (let i = 1; i <= 10; i++) {
    const f = await prisma.letterAssetFont.create({
      data: { font: `폰트_${i}`, fontFamily: `Family_${i}`, isActive: true }
    });
    fonts.push(f);
  }

  // --- 4. 유저 10명 생성 ---
  const passwordHash = await bcrypt.hash('password123', 10);
  const providers = ['soksak', 'naver', 'google', 'kakao'];
  const users = [];

  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        name: `사용자${i}`,
        nickname: `닉네임${i}`,
        phoneNumber: `010-1234-567${i - 1}`,
        pool: i % 3 + 1,
        auths: { create: { provider: providers[i % 4], username: `username${i}`, passwordHash, email: `user${i}@example.com` } },
        agreements: { create: { termsAgreed: true, privacyAgreed: true, ageOver14Agreed: true, marketingAgreed: true } },
        notificationSetting: { create: { letterEnabled: true, marketingEnabled: false } },
        interests: {
          create: [{ interestId: allInterests[i % 17].id }, { interestId: allInterests[(i + 1) % 17].id }]
        }
      }
    });
    users.push(user);
  }

  // --- 5. 친구 및 매칭 세션 (상태: friend) ---
  for (let i = 0; i < 4; i += 2) {
    await prisma.friend.create({ data: { userAId: users[i].id, userBId: users[i + 1].id } });
    await prisma.matchingSession.create({
      data: {
        questionId: allQuestions[i].id,
        status: 'friend',
        participants: {
          create: [{ userId: users[i].id }, { userId: users[i + 1].id }]
        }
      }
    });
  }

  // --- 6. 편지 100개 (유저당 10개) + 디자인 연결 ---
  for (const user of users) {
    for (let j = 0; j < 10; j++) {
      const isSelf = j < 3;
      const isFriend = j >= 3 && j < 7;
      
      await prisma.letter.create({
        data: {
          senderUserId: user.id,
          receiverUserId: isSelf ? user.id : (isFriend ? users[(users.indexOf(user) + 1) % 10].id : null),
          letterType: isSelf ? 'self' : (isFriend ? 'friend' : 'public'),
          title: `${user.nickname}의 ${j + 1}번째 편지`,
          content: `테스트 편지 내용입니다. 디자인 에셋이 잘 적용되었는지 확인하세요.`,
          isPublic: j >= 7,
          status: 'delivered',
          questionId: allQuestions[j].id,
          // 디자인 정보 연결 (랜덤하게 10개 중 하나씩 선택)
          design: {
            create: {
              paperId: papers[Math.floor(Math.random() * 10)].id,
              stampId: stamps[Math.floor(Math.random() * 10)].id,
              fontId: fonts[Math.floor(Math.random() * 10)].id,
            }
          }
        }
      });
    }
    console.log(`- ${user.name}의 디자인된 편지 생성 완료`);
  }

  console.log('시드 데이터 주입 성공!');
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });