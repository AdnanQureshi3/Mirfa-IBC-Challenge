import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";
import { TxSecureRecord } from "../types/tx.types";

const store = new Map<string, TxSecureRecord>();

export function encryptTx(
  app: FastifyInstance,
  partyId: string,
  payload: any
) {
  const id = randomUUID();

  const record: TxSecureRecord = {
    id,
    partyId,
    createdAt: new Date().toISOString(),

    payload_nonce: "stub",
    payload_ct: "stub",
    payload_tag: "stub",

    dek_wrap_nonce: "stub",
    dek_wrapped: "stub",
    dek_wrap_tag: "stub",

    alg: "AES-256-GCM",
    mk_version: 1
  };

  store.set(id, record);

  return record;
}

export function getTx(app: FastifyInstance, id: string) {
  return store.get(id);
}
