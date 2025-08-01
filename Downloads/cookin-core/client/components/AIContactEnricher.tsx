'use client';

import { useState } from 'react';

export default function AIContactEnricher({ contact }: { contact: any }) {
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState<string | null>(null);

  const enrich = async () => {
    setLoading(true);
    const res = await fetch('/api/ai/enrich-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact }),
    });
    const { persona } = await res.json();
    setPersona(persona);
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <button
        onClick={enrich}
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        ✨ Enrich with GPT
      </button>
      {persona && (
        <p className="mt-2 text-sm italic text-gray-700">Persona: {persona}</p>
      )}
    </div>
  );
}
