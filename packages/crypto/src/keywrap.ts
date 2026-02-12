import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

export function wrapKey(masterKey: Buffer, dek: Buffer) {
  const nonce = randomBytes(12);

  const cipher = createCipheriv("aes-256-gcm", masterKey, nonce);

  const wrapped = Buffer.concat([
    cipher.update(dek),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  return {
    nonce,
    wrapped,
    tag
  };
}

export function unwrapKey(
  masterKey: Buffer,
  nonce: Buffer,
  wrapped: Buffer,
  tag: Buffer
) {
  const decipher = createDecipheriv("aes-256-gcm", masterKey, nonce);
  decipher.setAuthTag(tag);

  return Buffer.concat([
    decipher.update(wrapped),
    decipher.final()
  ]);
}
