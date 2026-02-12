import {
  pgTable,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core"

export const txSecureRecords = pgTable("tx_secure_records", {
  id: text("id").primaryKey(),
  partyId: text("party_id").notNull(),
  createdAt: timestamp("created_at").notNull(),

  payload_nonce: text("payload_nonce").notNull(),
  payload_ct: text("payload_ct").notNull(),
  payload_tag: text("payload_tag").notNull(),

  dek_wrap_nonce: text("dek_wrap_nonce").notNull(),
  dek_wrapped: text("dek_wrapped").notNull(),
  dek_wrap_tag: text("dek_wrap_tag").notNull(),

  alg: text("alg").notNull(),
  mk_version: integer("mk_version").notNull(),
})
