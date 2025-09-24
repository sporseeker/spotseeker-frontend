import {
  randomBytes,
  scryptSync,
  createCipheriv,
  createDecipheriv,
  BinaryLike,
} from "crypto";

const algorithm = "aes-256-ctr";
const encoding = "hex";

const generateSalt = (): string => {
  return randomBytes(16).toString(encoding);
};

const deriveKey = (password: string, salt: string): Buffer => {
  return scryptSync(password, salt, 32);
};

export const encrypt = (text: string, password: string): string => {
  const salt = generateSalt();
  const key = deriveKey(password, salt);
  const iv = randomBytes(16);

  const cipher = createCipheriv(algorithm, key as BinaryLike, iv as BinaryLike);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8") as Uint8Array,
    cipher.final() as Uint8Array,
  ]);

  return `${salt}:${iv.toString(encoding)}:${encrypted.toString(encoding)}`;
};

// Decryption function
export const decrypt = (encryptedData: string, password: string): string => {
  const [salt, iv, encryptedText] = encryptedData.split(":");
  const key = deriveKey(password, salt);
  const decipher = createDecipheriv(
    algorithm,
    key as BinaryLike,
    Buffer.from(iv, encoding) as BinaryLike,
  );

  const decrypted = Buffer.concat([
    decipher.update(
      Buffer.from(encryptedText, encoding) as Uint8Array,
    ) as Uint8Array,
    decipher.final() as Uint8Array,
  ]);

  return decrypted.toString("utf8");
};
