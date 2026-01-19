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
  const passphrase = process.env.OCI_PRIVATE_KEY_PASSPHRASE || undefined;
  const regionId = requiredEnv("OCI_REGION");

  const privateKey = fs.readFileSync(privateKeyPath, "utf8").trim();
  if (
    !privateKey.includes("BEGIN PRIVATE KEY") &&
    !privateKey.includes("BEGIN RSA PRIVATE KEY")
  ) {
    throw new Error("Invalid private key format (BEGIN PRIVATE KEY / BEGIN RSA PRIVATE KEY 필요)");
  }

  // Provider 생성 (여기서는 region을 provider에 굳이 억지로 넣지 않아도 됨)
  const provider = new common.SimpleAuthenticationDetailsProvider(
    tenancyId,
    userId,
    fingerprint,
    privateKey,
    passphrase
  );

  const client = new objectstorage.ObjectStorageClient({
    authenticationDetailsProvider: provider
  });

  // ✅ 핵심: regionId 세팅이 endpoint까지 만들어줌 :contentReference[oaicite:1]{index=1}
  try {
    client.regionId = regionId;
  } catch {
    // regionId 매핑이 깨지면 endpoint 직접 세팅으로 우회
    client.endpoint = `https://objectstorage.${regionId}.oraclecloud.com`;
  }

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

  const namespaceName = requiredEnv("OCI_NAMESPACE");
  const bucketName = requiredEnv("OCI_BUCKET_NAME");
  const regionId = requiredEnv("OCI_REGION");

  const ext = mimeToExt(mimeType);
  if (!ext) {
    const err = new Error("지원하지 않는 이미지 형식입니다. (jpg/png/webp 허용)");
    err.code = "UNSUPPORTED_IMAGE_TYPE";
    err.statusCode = 400;
    throw err;
  }

  const objectName = `profiles/${userId}/profile${ext}`;

  const client = getObjectStorageClient();

  // (선택) 연결 확인용. 문제 생기면 여기서 바로 터짐.
  // await client.getNamespace({});

  await client.putObject({
    namespaceName,
    bucketName,
    objectName,
    contentType: mimeType,
    contentLength: fileBuffer.length,
    putObjectBody: fileBuffer
  });

  // 주의: 버킷이 private면 이 URL은 "형식"만 맞고 접근은 막힐 수 있음 (PAR 권장)
  const publicUrl =
    `https://objectstorage.${regionId}.oraclecloud.com` +
    `/n/${namespaceName}/b/${bucketName}/o/${encodeURIComponent(objectName)}`;

  return { objectName, publicUrl };
};
