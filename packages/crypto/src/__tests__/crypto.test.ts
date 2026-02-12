import { describe, it, expect } from "vitest";
import {
  encryptPayload,
  decryptPayload,
  wrapKey,
  unwrapKey
} from "../index";

import { randomBytes } from "crypto";

describe("Envelope Encryption Tests", () => {

  it("encrypt → decrypt works", () => {
    const payload = { amount: 100, currency: "AED" };
    const dek = randomBytes(32);

    // Correct order: (dek, payload)
    const encrypted = encryptPayload(dek, payload);

    // Correct order: (dek, nonce, ciphertext, tag)
    const decrypted = decryptPayload(
      dek,
      encrypted.nonce,
      encrypted.ciphertext,
      encrypted.tag
    );

    expect(decrypted).toEqual(payload);
  });

  it("tampered ciphertext fails", () => {
    const payload = { amount: 100, currency: "AED" };
    const dek = randomBytes(32);

    const encrypted = encryptPayload(dek, payload);

    // Tamper ciphertext
    encrypted.ciphertext[0] ^= 0xff;

    expect(() =>
      decryptPayload(
        dek,
        encrypted.nonce,
        encrypted.ciphertext,
        encrypted.tag
      )
    ).toThrow();
  });

  it("tampered tag fails", () => {
    const payload = { amount: 100, currency: "AED" };
    const dek = randomBytes(32);

    const encrypted = encryptPayload(dek, payload);

    // Tamper tag
    encrypted.tag[0] ^= 0xff;

    expect(() =>
      decryptPayload(
        dek,
        encrypted.nonce,
        encrypted.ciphertext,
        encrypted.tag
      )
    ).toThrow();
  });

  it("wrong nonce length fails", () => {
    const payload = { amount: 100, currency: "AED" };
    const dek = randomBytes(32);

    const encrypted = encryptPayload(dek, payload);

    const wrongNonce = randomBytes(8);

    expect(() =>
      decryptPayload(
        dek,
        wrongNonce,
        encrypted.ciphertext,
        encrypted.tag
      )
    ).toThrow();
  });

  it("wrap → unwrap key works", () => {
    const masterKey = randomBytes(32);
    const dek = randomBytes(32);

    const wrapped = wrapKey(masterKey, dek);

    const unwrapped = unwrapKey(
      masterKey,
      wrapped.nonce,
      wrapped.wrapped,
      wrapped.tag
    );

    expect(unwrapped.equals(dek)).toBe(true);
  });

});
