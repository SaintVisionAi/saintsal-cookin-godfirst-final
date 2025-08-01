export async function broadcastToSlack(message: string) {
  const url = process.env.SLACK_ALERT_WEBHOOK!;
  const payload = {
    text: `�� *SaintSal Broadcast*\n\n${message}`,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return res.ok;
}
