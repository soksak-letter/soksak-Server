import fs from "fs";
import * as common from "oci-common";
import * as objectstorage from "oci-objectstorage";

const requiredEnv = (key) => {
  const v = process.env[key];
  if (!v) throw new Error(`환경변수 ${key} 가(이) 필요합니다.`);
  return String(v).trim();
};

const mimeToExt = (mime) => {
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  return null;
};

let cachedClient = null;

const getObjectStorageClient = () => {
  if (cachedClient) return cachedClient;

  const tenancyId = requiredEnv("OCI_TENANCY_OCID");
  const userId = requiredEnv("OCI_USER_OCID");
  const fingerprint = requiredEnv("OCI_FINGERPRINT");
  const privateKeyPath = requiredEnv("OCI_PRIVATE_KEY_PATH");
  const passphrase = process.env.OCI_PRIVATE_KEY_PASSPHRASE || null;
  const regionId = requiredEnv("OCI_REGION"); // 예: 'ap-seoul-1'

  // Windows 줄바꿈(\r\n) 및 공백 제거
  const privateKey = fs.readFileSync(privateKeyPath, "utf8")
  .replace(/\r/g, "") // 모든 \r 문자를 제거하여 \n으로 통일
  .trim();
  
  // 리전 문자열을 OCI 리전 객체로 변환
  const regionObj = common.Region.fromRegionId(regionId);

  // 1. Provider 생성 (인자 5개 또는 6개 가능)
  const provider = new common.SimpleAuthenticationDetailsProvider(
    tenancyId,
    userId,
    fingerprint,
    privateKey,
    passphrase,
    regionObj // Provider에도 리전 객체 전달
  );

  // 2. ✅ 핵심: 생성자 옵션에서 모든 설정을 끝내야 함
  // 생성 후 client.endpoint나 client.regionId를 수동으로 수정하면 주소 파싱 에러가 날 수 있음
  const client = new objectstorage.ObjectStorageClient({
    authenticationDetailsProvider: provider,
    region: regionObj // 문자열 대신 객체 전달 권장
  });

  cachedClient = client;
  return client;
};

export const uploadUserProfileImage = async ({ userId, fileBuffer, mimeType }) => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (!fileBuffer || fileBuffer.length === 0) {
    const err = new Error("업로드할 파일이 비어있습니다.");
    err.statusCode = 400;
    throw err;
  }
  if (fileBuffer.length > MAX_FILE_SIZE) {
    const err = new Error("파일 크기가 너무 큽니다. 최대 5MB까지 업로드 가능합니다.");
    err.code = "FILE_TOO_LARGE";
    err.statusCode = 400;
    throw err;
  }
  console.log("파일은 받음");
  const namespaceName = requiredEnv("OCI_NAMESPACE");
  const bucketName = requiredEnv("OCI_BUCKET_NAME");
  const regionId = requiredEnv("OCI_REGION");
  console.log(namespaceName);
  console.log(bucketName);
  console.log(regionId);
  const ext = mimeToExt(mimeType);
  if (!ext) {
    const err = new Error("지원하지 않는 이미지 형식입니다. (jpg/png/webp 허용)");
    err.code = "UNSUPPORTED_IMAGE_TYPE";
    err.statusCode = 400;
    throw err;
  }
  console.log("여기까지");
  const objectName = `profiles/${userId}/profile${ext}`;

  const client = getObjectStorageClient();

  // (선택) 연결 확인용. 문제 생기면 여기서 바로 터짐.
  // await client.getNamespace({});
  try {
    await client.putObject({
      namespaceName,
      bucketName,
      objectName,
      contentType: mimeType,
      contentLength: fileBuffer.length,
      putObjectBody: fileBuffer
    });
  } catch (error) {
    console.error("❌ OCI 상세 에러 발생:");
    console.error("상태 코드:", error.statusCode);
    console.error("에러 코드:", error.code);
    console.error("메시지:", error.message);
    console.error("요청 ID:", error.opcRequestId);
    throw error;
  }

  // 주의: 버킷이 private면 이 URL은 "형식"만 맞고 접근은 막힐 수 있음 (PAR 권장)
  const publicUrl =
    `https://objectstorage.${regionId}.oraclecloud.com` +
    `/n/${namespaceName}/b/${bucketName}/o/${encodeURIComponent(objectName)}`;

  return { objectName, publicUrl };
};
