import fs from "fs";
import * as common from "oci-common";
import * as objectstorage from "oci-objectstorage";
import { requiredEnv } from "../utils/user.util.js";

let cachedClient = null;

export const getObjectStorageClient = () => {
  if (cachedClient) return cachedClient;

  const tenancyId = requiredEnv("OCI_TENANCY_OCID");
  const userId = requiredEnv("OCI_USER_OCID");
  const fingerprint = requiredEnv("OCI_FINGERPRINT");
  const privateKeyPath = requiredEnv("OCI_PRIVATE_KEY_PATH");
  const passphrase = process.env.OCI_PRIVATE_KEY_PASSPHRASE || null;
  const regionId = requiredEnv("OCI_REGION");

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
};
