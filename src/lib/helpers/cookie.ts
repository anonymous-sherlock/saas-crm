import * as crypto from "crypto";
import { env } from "../../env.mjs";

const defaultSecretKey = env.NEXTAUTH_SECRET ?? "";

// Function to encrypt the cookie value
export function encryptCookie(value: any, secretKey: string = defaultSecretKey): string {
  const algorithm = "aes-256-cbc";
  const key = crypto.scryptSync(secretKey, "salt", 32);
  const iv = Buffer.alloc(16, 0); // Initialization vector

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedValue = cipher.update(JSON.stringify(value), "utf8", "hex");
  encryptedValue += cipher.final("hex");
  return encryptedValue;
}

// Function to decrypt the cookie value
export function decryptCookie(encryptedValue: string, secretKey: string = defaultSecretKey): any {
  try {
    if (!encryptedValue) {
      console.error("Error decrypting cookie: Encrypted value is empty.");
      return null;
    }

    const algorithm = "aes-256-cbc";
    const key = crypto.scryptSync(secretKey, "salt", 32);
    const iv = Buffer.alloc(16, 0); // Initialization vector

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decryptedValue = decipher.update(encryptedValue, "hex", "utf8");
    decryptedValue += decipher.final("utf8");

    return JSON.parse(decryptedValue);
  } catch (error) {
    console.error("Error decrypting cookie:", error);
    return null; // or handle the error in an appropriate way
  }
}
