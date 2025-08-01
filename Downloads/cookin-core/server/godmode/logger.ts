// 📦 godmode/logger.ts — Divine Logging Layer

import { createNotionEntry } from "@/lib/actions/notion"

export async function logDivineEvent(event: string, payload: Record<string, any>) {
  try {
    await createNotionEntry(process.env.NOTION_LOGS_DB || "", `${event}: ${JSON.stringify(payload)}`)
    console.log(`📜 Divine Event Logged: ${event}`)
  } catch (err) {
    console.error("❌ Divine log error:", err)
  }
}
