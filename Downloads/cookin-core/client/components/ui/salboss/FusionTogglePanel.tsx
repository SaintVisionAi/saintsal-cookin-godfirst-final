'use client'

// 📦 components/ui/salboss/FusionTogglePanel.tsx — SaintSal Boss Escalation Overlay
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { CheckCircle2, Zap, ShieldCheck, BrainCircuit } from "lucide-react"

export default function FusionTogglePanel() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"normal" | "boss">("normal")

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <Button
        variant="secondary"
        onClick={() => setOpen(!open)}
        className="rounded-full px-4 py-2 text-xs shadow-lg"
      >
        <Zap className="mr-2 h-4 w-4" />
        SaintSal Fusion
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-64 rounded-2xl border bg-white p-4 text-sm shadow-2xl dark:bg-black"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-muted-foreground">Mode</span>
              <Switch
                checked={mode === "boss"}
                onCheckedChange={() =>
                  setMode((prev) => (prev === "normal" ? "boss" : "normal"))
                }
              />
            </div>

            <div className="mb-3 text-xs text-gray-500 dark:text-gray-400">
              {mode === "normal" ? (
                <>
                  <ShieldCheck className="mr-1 inline h-3 w-3 text-green-500" />
                  SaintSal running in Covenant Mode.
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-1 inline h-3 w-3 text-purple-500" />
                  Boss Override Engaged. All limitations suspended.
                </>
              )}
            </div>

            <Button
              variant="destructive"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                // 📡 Trigger server override route
                fetch("/api/hacp/trigger", {
                  method: "POST",
                  body: JSON.stringify({
                    userId: "superadmin",
                    tier: "founder",
                    action: "override",
                    data: { mode }
                  }),
                  headers: { "Content-Type": "application/json" }
                })
              }}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirm Escalation
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
