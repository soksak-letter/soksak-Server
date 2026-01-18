import fs from "fs";
import * as common from "oci-common";
import * as objectstorage from "oci-objectstorage";

const requiredEnv = (key) => {
  const v = process.env[key];
  if (!v) throw new Error(`환경변수 ${key} 가(이) 필요합니다.`);
  return v;
};


const getAuthProvider = () => {
  try {
    const tenancyId = requiredEnv("OCI_TENANCY_OCID");
    const userId = requiredEnv("OCI_USER_OCID");
    const fingerprint = requiredEnv("OCI_FINGERPRINT");
    const privateKeyPath = requiredEnv("OCI_PRIVATE_KEY_PATH");
    const passphrase = process.env.OCI_PRIVATE_KEY_PASSPHRASE || undefined;
    const regionStr = requiredEnv("OCI_REGION");

    console.log("[OCI Debug] privateKeyPath:", privateKeyPath);
    console.log("[OCI Debug] File exists?", fs.existsSync(privateKeyPath));
    console.log("[OCI Debug] tenancyId:", tenancyId);
    console.log("[OCI Debug] userId:", userId);
    console.log("[OCI Debug] fingerprint:", fingerprint);
    console.log("[OCI Debug] passphrase:", passphrase ? "***" : "undefined");
    console.log("[OCI Debug] region:", regionStr);
    
    const privateKeyRaw = fs.readFileSync(privateKeyPath, "utf8");
    
    // Private key 정리 (앞뒤 공백 제거, 줄바꿈 정규화)
    const privateKey = privateKeyRaw.trim();
    
    console.log("[OCI Debug] Private key loaded, length:", privateKey.length);
    console.log("[OCI Debug] Private key starts with:", privateKey.substring(0, 50));
    console.log("[OCI Debug] Private key ends with:", privateKey.substring(privateKey.length - 50));
    
    // Private key 형식 검증
    if (!privateKey.includes("BEGIN PRIVATE KEY") && !privateKey.includes("BEGIN RSA PRIVATE KEY")) {
      throw new Error("Invalid private key format. Must start with -----BEGIN PRIVATE KEY----- or -----BEGIN RSA PRIVATE KEY-----");
    }

    // Region 객체 생성
    const region = common.Region.fromRegionId(regionStr);
    console.log("[OCI Debug] Region in provider:", region._regionId);

    // SimpleAuthenticationDetailsProvider 생성 - region 포함
    const provider = new common.SimpleAuthenticationDetailsProvider(
      tenancyId,
      userId,
      fingerprint,
      privateKey,
      passphrase,
      undefined,  // additionalFederatedClaims
      region      // region 포함
    );
    
    console.log("[OCI Debug] Provider created successfully");
    return provider;
  } catch (error) {
    console.error("[OCI Debug] Error in getAuthProvider:", error);
    console.error("[OCI Debug] Error stack:", error.stack);
    throw error;
  }
};

const getObjectStorageClient = () => {
  try {
    const provider = getAuthProvider();
    const regionStr = requiredEnv("OCI_REGION");
    console.log("[OCI Debug] Region string:", regionStr);
    
    // Region 객체 생성
    const region = common.Region.fromRegionId(regionStr);
    console.log("[OCI Debug] Region object:", region);
    console.log("[OCI Debug] Region _regionId:", region._regionId);
    
    // 재시도 비활성화 - 1회만 시도하도록 설정
    const retryConfiguration = {
      terminationStrategy: new common.MaxAttemptsTerminationStrategy(1),
      retryDurationBase: 0
    };
    
    // ObjectStorageClient 생성 - 첫 번째 파라미터에 region 포함, 재시도 비활성화
    const client = new objectstorage.ObjectStorageClient({
      authenticationDetailsProvider: provider,
      region: region,
      retryConfiguration: retryConfiguration  // 1회만 시도
    });
    
    console.log("[OCI Debug] Client created successfully");
    // client의 내부 속성 확인
    if (client.configuration) {
      console.log("[OCI Debug] Client configuration region:", client.configuration.region);
    }
    
    return client;
  } catch (error) {
    console.error("[OCI Debug] Error in getObjectStorageClient:", error);
    console.error("[OCI Debug] Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    throw error;
  }
};


const mimeToExt = (mime) => {
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  return null;
};

export const uploadUserProfileImage = async ({ userId, fileBuffer, mimeType }) => {
  try {
    // 파일 크기 제한 추가 (메모리 부족 방지)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (fileBuffer.length > MAX_FILE_SIZE) {
      const err = new Error("파일 크기가 너무 큽니다. 최대 5MB까지 업로드 가능합니다.");
      err.code = "FILE_TOO_LARGE";
      err.statusCode = 400;
      throw err;
    }

    const namespaceName = requiredEnv("OCI_NAMESPACE");
    const bucketName = requiredEnv("OCI_BUCKET_NAME");

    console.log("[OCI Debug] namespaceName:", namespaceName);
    console.log("[OCI Debug] bucketName:", bucketName);
    console.log("[OCI Debug] File size:", fileBuffer.length, "bytes");
    
    // 인증 테스트를 위한 간단한 요청 시도 (getNamespace)
    try {
      const client = getObjectStorageClient();
      console.log("[OCI Debug] Testing authentication with getNamespace...");
      const namespaceTest = await client.getNamespace({});
      console.log("[OCI Debug] getNamespace succeeded:", namespaceTest);
      if (namespaceTest.namespace !== namespaceName) {
        console.warn("[OCI Debug] WARNING: getNamespace returned:", namespaceTest.namespace, "but expected:", namespaceName);
      }
    } catch (authTestError) {
      console.error("[OCI Debug] ========== AUTHENTICATION TEST FAILED ==========");
      console.error("[OCI Debug] Auth test error type:", typeof authTestError);
      console.error("[OCI Debug] Auth test error constructor:", authTestError?.constructor?.name);
      console.error("[OCI Debug] Auth test error message:", authTestError?.message);
      if (authTestError?.statusCode) console.error("[OCI Debug] Auth test error statusCode:", authTestError.statusCode);
      if (authTestError?.serviceCode) console.error("[OCI Debug] Auth test error serviceCode:", authTestError.serviceCode);
      if (authTestError?.opcRequestId) console.error("[OCI Debug] Auth test error opcRequestId:", authTestError.opcRequestId);
      
      // 에러 객체의 모든 속성 확인
      try {
        const errorKeys = Object.keys(authTestError);
        console.error("[OCI Debug] Auth test error keys:", errorKeys);
        for (const key of errorKeys) {
          try {
            const value = authTestError[key];
            if (typeof value !== 'function') {
              console.error(`[OCI Debug] Auth test error.${key}:`, value);
            }
          } catch (e) {
            console.error(`[OCI Debug] Auth test error.${key}: [cannot access]`);
          }
        }
      } catch (e) {
        console.error("[OCI Debug] Cannot enumerate auth test error properties");
      }
      console.error("[OCI Debug] ============================================");
      throw authTestError;
    }

    const ext = mimeToExt(mimeType);
    if (!ext) {
      const err = new Error("지원하지 않는 이미지 형식입니다. (jpg/png/webp 허용)");
      err.code = "UNSUPPORTED_IMAGE_TYPE";
      throw err;
    }

    const objectName = `profiles/${userId}/profile${ext}`;
    console.log("[OCI Debug] objectName:", objectName);

    const client = getObjectStorageClient();
    console.log("[OCI Debug] About to call putObject...");
    console.log("[OCI Debug] putObject params:", {
      namespaceName,
      bucketName,
      objectName,
      contentType: mimeType,
      contentLength: fileBuffer.length,
      putObjectBodyLength: fileBuffer.length
    });

    // Promise를 명시적으로 처리하여 에러를 확실히 캐치
    console.log("[OCI Debug] Calling putObject now...");
    console.log("[OCI Debug] Client retry config:", client.retryConfiguration);
    
    // SDK의 내부 로깅을 가로채기 위해 console.log와 console.error를 백업
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    let firstErrorDetails = null;
    
    // console.log를 오버라이드하여 SDK의 재시도 로그에서 에러 정보 추출 시도
    console.log = (...args) => {
      if (args.length > 0 && typeof args[0] === 'string') {
        // SDK의 재시도 로그 확인
        if (args[0].includes('Request failed with Exception') || args[0].includes('Retrying request')) {
          console.error("[OCI Debug] ========== SDK RETRY LOG DETECTED ==========");
          console.error("[OCI Debug] Log args:", args);
          console.error("[OCI Debug] ============================================");
        }
      }
      originalConsoleLog.apply(console, args);
    };
    
    // console.error를 오버라이드하여 SDK의 내부 에러를 캐치
    console.error = (...args) => {
      if (args.length > 0) {
        const firstArg = args[0];
        // SDK의 에러 로그 확인
        if (typeof firstArg === 'string' && firstArg.includes('Request failed with Exception')) {
          console.error("[OCI Debug] ========== SDK ERROR LOG DETECTED ==========");
          console.error("[OCI Debug] Error log args:", args);
          // 모든 인자 확인
          for (let i = 0; i < args.length; i++) {
            try {
              if (typeof args[i] === 'object' && args[i] !== null) {
                const errorKeys = Object.keys(args[i]);
                console.error(`[OCI Debug] Error arg[${i}] keys:`, errorKeys);
                for (const key of errorKeys) {
                  try {
                    const value = args[i][key];
                    if (typeof value !== 'function') {
                      console.error(`[OCI Debug] Error arg[${i}].${key}:`, value);
                    }
                  } catch (e) {
                    console.error(`[OCI Debug] Error arg[${i}].${key}: [cannot log]`);
                  }
                }
              } else {
                console.error(`[OCI Debug] Error arg[${i}]:`, args[i]);
              }
            } catch (e) {
              console.error(`[OCI Debug] Cannot process error arg[${i}]`);
            }
          }
          console.error("[OCI Debug] ============================================");
        }
      }
      originalConsoleError.apply(console, args);
    };
    
    // 재시도 비활성화 - 요청 단위로도 설정
    const retryConfig = {
      terminationStrategy: new common.MaxAttemptsTerminationStrategy(1),
      retryDurationBase: 0
    };
    
    console.log("[OCI Debug] retryConfig for putObject:", retryConfig);
    
    // putObject를 Promise로 래핑하여 에러를 확실히 캐치
    // retryConfiguration을 요청 단위로도 전달
    const putObjectPromise = client.putObject({
      namespaceName,
      bucketName,
      objectName,
      contentType: mimeType,
      contentLength: fileBuffer.length,
      putObjectBody: fileBuffer,
      retryConfiguration: retryConfig  // 요청 단위로 재시도 비활성화
    });
    
    // 타임아웃 설정 (5초로 단축) - 빠르게 실패하도록
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        // console 복원
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
        reject(new Error("OCI putObject timeout after 5 seconds - SDK may be retrying internally"));
      }, 5000);
    });
    
    // Promise에 에러 핸들러 추가 - 즉시 에러 캐치
    putObjectPromise.catch((earlyError) => {
      console.error("[OCI Debug] ========== PROMISE.CATCH ERROR ==========");
      console.error("[OCI Debug] Error type:", typeof earlyError);
      console.error("[OCI Debug] Error constructor:", earlyError?.constructor?.name);
      console.error("[OCI Debug] Error message:", earlyError?.message);
      
      // 에러 객체의 모든 속성 확인 (심볼 포함)
      try {
        const allProps = Object.getOwnPropertyNames(earlyError);
        console.error("[OCI Debug] Error own properties:", allProps);
        for (const prop of allProps) {
          try {
            const value = earlyError[prop];
            if (typeof value !== 'function' && typeof value !== 'object') {
              console.error(`[OCI Debug] Error.${prop}:`, value);
            } else if (typeof value === 'object' && value !== null) {
              console.error(`[OCI Debug] Error.${prop} (object):`, JSON.stringify(value, null, 2));
            }
          } catch (e) {
            console.error(`[OCI Debug] Error.${prop}: [cannot access]`);
          }
        }
        
        // 프로토타입 체인 확인
        let proto = Object.getPrototypeOf(earlyError);
        let level = 0;
        while (proto && level < 3) {
          const protoProps = Object.getOwnPropertyNames(proto);
          console.error(`[OCI Debug] Error prototype level ${level} properties:`, protoProps);
          level++;
          proto = Object.getPrototypeOf(proto);
        }
      } catch (e) {
        console.error("[OCI Debug] Cannot enumerate error properties:", e);
      }
      
      console.error("[OCI Debug] ============================================");
    });
    
    try {
      // Promise.race를 사용하여 타임아웃 또는 성공 중 먼저 완료되는 것을 기다림
      const result = await Promise.race([putObjectPromise, timeoutPromise]);
      // console 복원
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.log("[OCI Debug] putObject returned:", result);
    } catch (putObjectError) {
      // console 복원
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.error("[OCI Debug] ========== PUTOBJECT ERROR CAUGHT (CATCH BLOCK REACHED) ==========");
      console.error("[OCI Debug] putObject error type:", typeof putObjectError);
      console.error("[OCI Debug] putObject error constructor:", putObjectError.constructor?.name);
      console.error("[OCI Debug] putObject error message:", putObjectError.message);
      console.error("[OCI Debug] putObject error statusCode:", putObjectError.statusCode);
      console.error("[OCI Debug] putObject error serviceCode:", putObjectError.serviceCode);
      console.error("[OCI Debug] putObject error requestEndpoint:", putObjectError.requestEndpoint);
      console.error("[OCI Debug] putObject error opcRequestId:", putObjectError.opcRequestId);
      
      // 모든 속성 출력
      if (putObjectError instanceof Error) {
        console.error("[OCI Debug] Error name:", putObjectError.name);
        console.error("[OCI Debug] Error stack:", putObjectError.stack);
      }
      
      // 모든 키 출력
      const errorKeys = Object.keys(putObjectError);
      console.error("[OCI Debug] Error keys:", errorKeys);
      for (const key of errorKeys) {
        try {
          console.error(`[OCI Debug] Error.${key}:`, putObjectError[key]);
        } catch (e) {
          console.error(`[OCI Debug] Error.${key}: [cannot log]`);
        }
      }
      
      console.error("[OCI Debug] ============================================");
      throw putObjectError;
    }
    
    console.log("[OCI Debug] putObject completed successfully");

    const region = requiredEnv("OCI_REGION");
    const publicUrl = `https://objectstorage.${region}.oraclecloud.com/n/${namespaceName}/b/${bucketName}/o/${encodeURIComponent(
      objectName
    )}`;

    return { objectName, publicUrl };
  } catch (error) {
    // 실제 에러 객체의 모든 속성 출력
    console.error("[OCI Debug] ========== ERROR DETAILS ==========");
    console.error("[OCI Debug] Error type:", typeof error);
    console.error("[OCI Debug] Error constructor:", error.constructor?.name);
    console.error("[OCI Debug] Error keys:", Object.keys(error));
    
    // 모든 속성을 개별적으로 출력
    for (const key of Object.keys(error)) {
      try {
        console.error(`[OCI Debug] Error.${key}:`, error[key]);
      } catch (e) {
        console.error(`[OCI Debug] Error.${key}: [cannot stringify]`);
      }
    }
    
    // JSON으로 변환 시도
    try {
      const errorStr = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
      console.error("[OCI Debug] Error JSON:", errorStr);
    } catch (e) {
      console.error("[OCI Debug] Cannot stringify error as JSON");
    }
    
    console.error("[OCI Debug] Error message:", error.message);
    console.error("[OCI Debug] Error stack:", error.stack);
    console.error("[OCI Debug] =====================================");
    
    throw error;
  }
};