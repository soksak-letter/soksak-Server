export class NoticeNotFoundError extends Error {
    constructor(noticeId) {
      super(`해당 공지사항을 찾을 수 없습니다. noticeId=${noticeId}`);
      this.name = "NoticeNotFoundError";
      this.statusCode = 404;
      this.code = "NOTICE_NOT_FOUND";
    }
  }
  
  export class InvalidNoticeIdError extends Error {
    constructor(noticeId) {
      super(`noticeId는 양의 정수여야 합니다. noticeId=${noticeId}`);
      this.name = "InvalidNoticeIdError";
      this.statusCode = 400;
      this.code = "INVALID_NOTICE_ID";
    }
  }
  