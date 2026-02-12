import { createDecipheriv } from "crypto";

export function decryptPayload(
  dek: Buffer,
  nonce: Buffer,
  ciphertext: Buffer,
  tag: Buffer
) {
  const decipher = createDecipheriv("aes-256-gcm", dek, nonce);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final()
  ]);

  return JSON.parse(decrypted.toString());
}
