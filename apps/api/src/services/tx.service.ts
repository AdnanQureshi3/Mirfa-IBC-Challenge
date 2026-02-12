import { randomBytes, randomUUID } from "crypto";
import {
  encryptPayload,
  wrapKey,
  decryptPayload,
  unwrapKey
} from "@mirfa/crypto";
import { TxSecureRecord } from "../types/tx.types";

const store = new Map<string, TxSecureRecord>();

function isValidHex(str: string) {
  return /^[0-9a-fA-F]+$/.test(str);
}

export function encryptTx(partyId: string, payload: any): TxSecureRecord {
  const masterKeyHex = process.env.MASTER_KEY;
  if (!masterKeyHex) throw new Error("MASTER_KEY not set");

  const MASTER_KEY = Buffer.from(masterKeyHex, "hex");

  const id = randomUUID().slice(0, 4);
  const dek = randomBytes(32);

  const { nonce, ciphertext, tag } = encryptPayload(dek, payload);
  const { nonce: wrapNonce, wrapped, tag: wrapTag } = wrapKey(MASTER_KEY, dek);

  const record: TxSecureRecord = {
    id,
    partyId,
    createdAt: new Date().toISOString(),

    payload_nonce: nonce.toString("hex"),
    payload_ct: ciphertext.toString("hex"),
    payload_tag: tag.toString("hex"),

    dek_wrap_nonce: wrapNonce.toString("hex"),
    dek_wrapped: wrapped.toString("hex"),
    dek_wrap_tag: wrapTag.toString("hex"),

    alg: "AES-256-GCM",
    mk_version: 1
  };

  store.set(id, record);
  return record;
}

export function getTx(id: string) {
  return store.get(id);
}

export function decryptTx(id: string) {
  const record = store.get(id);
  if (!record) throw new Error("Record not found");

  const masterKeyHex = process.env.MASTER_KEY;
  if (!masterKeyHex) throw new Error("MASTER_KEY not set");

  const hexFields = [
    record.payload_nonce,
    record.payload_ct,
    record.payload_tag,
    record.dek_wrap_nonce,
    record.dek_wrapped,
    record.dek_wrap_tag
  ];

  if (!hexFields.every(isValidHex)) {
    throw new Error("Invalid hex detected");
  }

  const MASTER_KEY = Buffer.from(masterKeyHex, "hex");

  const wrapNonce = Buffer.from(record.dek_wrap_nonce, "hex");
  const wrappedDek = Buffer.from(record.dek_wrapped, "hex");
  const wrapTag = Buffer.from(record.dek_wrap_tag, "hex");

  const payloadNonce = Buffer.from(record.payload_nonce, "hex");
  const ciphertext = Buffer.from(record.payload_ct, "hex");
  const payloadTag = Buffer.from(record.payload_tag, "hex");

  if (wrapNonce.length !== 12) throw new Error("Invalid wrap nonce length");
  if (payloadNonce.length !== 12) throw new Error("Invalid payload nonce length");
  if (wrapTag.length !== 16) throw new Error("Invalid wrap tag length");
  if (payloadTag.length !== 16) throw new Error("Invalid payload tag length");

  const dek = unwrapKey(MASTER_KEY, wrapNonce, wrappedDek, wrapTag);

  return decryptPayload(dek, payloadNonce, ciphertext, payloadTag);
}
