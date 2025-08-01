'use client';

import { useState } from 'react';

export default function ReferralEngine() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submitReferral = async () => {
    setLoading(true);
    await fetch('/api/referral/log', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="border p-4 rounded shadow bg-blue-50 mb-6">
      <h2 className="text-xl font-semibold mb-2">🎁 Invite a Friend</h2>
      <p className="text-sm text-gray-700 mb-3">Share the divine tool. Track your referrals.</p>
      <input
        type="email"
        className="border p-2 rounded w-full mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="their@email.com"
        disabled={sent}
      />
      <button
        onClick={submitReferral}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading || sent}
      >
        {loading ? 'Sending...' : sent ? 'Sent ✅' : 'Send Invite'}
      </button>
    </div>
  );
}
