import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { loginCredentials } from "@/lib/dsql";

const region = process.env.AWS_REGION ?? "us-east-1";

function bucket() {
  return process.env.SLIP_BUCKET || "albarika-slips-928743259027";
}

let client: S3Client | null = null;

function s3() {
  client ??= new S3Client({ region, credentials: loginCredentials });
  return client;
}

function fileOf(base64: string) {
  const file = base64.trim().replace(/^data:[^;]+;base64,/, "").replace(/\s/g, "");
  if (file.startsWith("/9j/")) return { file, extension: "jpg", type: "image/jpeg" };
  if (file.startsWith("iVBOR")) return { file, extension: "png", type: "image/png" };
  return { file, extension: "pdf", type: "application/pdf" };
}

export async function storeSlip(id: string, base64: string) {
  const { file, extension, type } = fileOf(base64);
  if (!file) return "";
  const key = `verification-slips/${id}.${extension}`;
  await s3().send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: Buffer.from(file, "base64"),
      ContentType: type,
      ServerSideEncryption: "AES256",
    }),
  );
  return key;
}

export async function readSlipFile(key: string) {
  if (!key.startsWith("verification-slips/")) return "";
  return readObject(key);
}

export async function storeStudentPhoto(id: string, base64: string) {
  const file = base64.trim().replace(/^data:[^;]+;base64,/, "").replace(/\s/g, "");
  const jpeg = file.startsWith("/9j/");
  const png = file.startsWith("iVBOR");
  if ((!jpeg && !png) || file.length < 100 || file.length > 1_800_000) throw new Error("photograph");
  const key = `student-photos/${id}.${jpeg ? "jpg" : "png"}`;
  await s3().send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: Buffer.from(file, "base64"),
      ContentType: jpeg ? "image/jpeg" : "image/png",
      ServerSideEncryption: "AES256",
    }),
  );
  return key;
}

export async function readStudentPhoto(key: string) {
  if (!key.startsWith("student-photos/")) return "";
  return readObject(key);
}

async function readObject(key: string) {
  const response = await s3().send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
  const bytes = await response.Body?.transformToByteArray();
  if (!bytes?.length) return "";
  return Buffer.from(bytes).toString("base64");
}
