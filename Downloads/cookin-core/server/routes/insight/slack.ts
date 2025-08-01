import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(process.env.SLACK_ALERT_WEBHOOK!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `📢 *Insight Shared via SaintSal*\n*${body.title}*\n${body.summary}`,
    }),
  });

  return res.ok
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: 'Slack send failed' }, { status: 500 });
}
