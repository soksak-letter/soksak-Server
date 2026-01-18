export const MAILBOX_ERROR = {
    UNAUTHORIZED: {
      statusCode: 401,
      errorCode: "MAILBOX_UNAUTHORIZED",
      message: "인증이 필요합니다.",
    },
    INVALID_THREAD_ID: {
      statusCode: 400,
      errorCode: "MAILBOX_INVALID_THREAD_ID",
      message: "threadId가 올바르지 않습니다.",
    },
  };
  
  export const throwMailboxError = (errorObj, detail = null) => {
    const err = new Error(errorObj.message);
    err.statusCode = errorObj.statusCode;
    err.errorCode = errorObj.errorCode;
    err.reason = errorObj.message;
    err.data = detail ?? null;
    throw err;
  };
  