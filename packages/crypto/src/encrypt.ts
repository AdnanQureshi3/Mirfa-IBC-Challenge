import { randomBytes, createCipheriv } from "crypto";

export function encryptPayload(dek: Buffer, payload: object) {
  const nonce = randomBytes(12);

  const cipher = createCipheriv("aes-256-gcm", dek, nonce);

  const ciphertext = Buffer.concat([
    cipher.update(Buffer.from(JSON.stringify(payload))),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  return {
    nonce,
    ciphertext,
    tag
  };
}
