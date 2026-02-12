import { db } from "./client.js"
import { txSecureRecords } from "./schema.js"
import { eq } from "drizzle-orm"
import { TxSecureRecord } from "../types/tx.types.js"

export async function insertTx(record: TxSecureRecord) {
  await db.insert(txSecureRecords).values({
    ...record,
    createdAt: new Date(record.createdAt),
  })
  
}

export async function findTxById(id: string) {
  const result = await db
    .select()
    .from(txSecureRecords)
    .where(eq(txSecureRecords.id, id))

  if (!result.length) return null

  return {
    ...result[0],
    createdAt: result[0].createdAt.toISOString(),
  }
}
