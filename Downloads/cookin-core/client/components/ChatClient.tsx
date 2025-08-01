
"use client"

import { useEffect, useRef, useState } from "react"

export default function ChatClient() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMsg = { role: "user", content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    const res = await fetch("/api/chat/openai", {
      method: "POST",
      body: JSON.stringify({
        messages: [...messages, userMsg],
        chatSettings: {
          temperature: 0.7,
          model: "gpt-4o", // can be switched to gpt-4-vision-preview if needed
        },
      }),
    })

    if (!res.ok) {
      const { message } = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: "system", content: `⚠️ Error: ${message}` },
      ])
      setLoading(false)
      return
    }

    const { choices } = await res.json()
    const reply = choices?.[0]?.message?.content || "(no response)"
    setMessages((prev) => [...prev, { role: "assistant", content: reply }])
    setLoading(false)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen p-4 bg-zinc-900 text-white">
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className="whitespace-pre-wrap">
            <strong>{msg.role === "user" ? "You" : "SaintSAL"}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div>⏳ Thinking...</div>}
        <div ref={chatRef}></div>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        rows={2}
        placeholder="Say something..."
        className="mt-4 p-2 bg-zinc-800 border border-zinc-700 rounded w-full resize-none focus:outline-none"
      />
      <button
        onClick={sendMessage}
        className="mt-2 p-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        Send
      </button>
    </div>
  )
}
