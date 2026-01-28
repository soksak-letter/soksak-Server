import fs from "fs";
import * as common from "oci-common";
import * as objectstorage from "oci-objectstorage";
import { requiredEnv } from "../utils/user.util.js";
import { StorageConfigError } from "../errors/user.error.js";

let cachedClient = null;

export const getObjectStorageClient = () => {
  if (cachedClient) return cachedClient;

  const tenancyId = requiredEnv("OCI_TENANCY_OCID");
  const userId = requiredEnv("OCI_USER_OCID");
  const fingerprint = requiredEnv("OCI_FINGERPRINT");
  const privateKeyPath = requiredEnv("OCI_PRIVATE_KEY_PATH");
  const passphrase = process.env.OCI_PRIVATE_KEY_PASSPHRASE || null;
  const regionId = requiredEnv("OCI_REGION");

  try {
    const privateKey = fs
      .readFileSync(privateKeyPath, "utf8")
      .replace(/\r/g, "")
      .trim();

    const regionObj = common.Region.fromRegionId(regionId);

    const provider = new common.SimpleAuthenticationDetailsProvider(
      tenancyId,
      userId,
      fingerprint,
      privateKey,
      passphrase,
      regionObj
    );

    const client = new objectstorage.ObjectStorageClient({
      authenticationDetailsProvider: provider,
      region: regionObj,
    });

    cachedClient = client;
    return client;
  } catch (error) {
    throw new StorageConfigError("USER_STORAGE_CONFIG_ERROR", `Object Storage 설정 중 오류가 발생했습니다. (Private Key 파일 읽기 실패 또는 클라이언트 생성 실패): ${error.message}`, { originalError: error.message });
  }
};
