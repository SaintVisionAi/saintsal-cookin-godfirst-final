import { openai } from '@/lib/openai';

export async function scoreLead(leadDetails: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an AI CRM analyst. Score leads from 1 to 10 and explain.',
      },
      {
        role: 'user',
        content: `Lead details:\n${leadDetails}`,
      },
    ],
  });

  const message = response.choices[0].message.content;
  const [scoreLine, ...explanation] = message.split('\n');
  const score = parseFloat(scoreLine.match(/([\d.]+)/)?.[0] || '0');

  return {
    score,
    rationale: explanation.join('\n'),
  };
}
