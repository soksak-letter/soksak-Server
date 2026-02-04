import "dotenv/config";
import { sendNoticePushNotification } from "../src/services/notice.service.js";

/**
 * 공지사항 푸시 알림 전송 스크립트
 * 
 * 사용 방법:
 *   node scripts/send-notice-push.js
 * 
 * 기능:
 *   - 최근 10분 이내 생성된 공지사항을 찾습니다
 *   - marketingEnabled: true인 사용자에게 푸시 알림을 전송합니다
 */
const main = async () => {
  try {
    console.log("공지사항 푸시 알림 전송을 시작합니다...");
    
    const result = await sendNoticePushNotification();
    
    console.log("\n=== 전송 결과 ===");
    console.log(`공지사항: ${result.notices.length}개`);
    console.log(`대상 사용자: ${result.users}명`);
    console.log(`성공: ${result.sent}건`);
    console.log(`실패: ${result.failed || 0}건`);
    
    process.exit(0);
  } catch (error) {
    console.error("에러 발생:", error);
    process.exit(1);
  }
};

main();
