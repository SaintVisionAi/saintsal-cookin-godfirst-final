import { openai } from '@/lib/openai';

export async function generatePersona(leadInfo: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a GPT contact enrichment agent. Create a persona summary.',
      },
      {
        role: 'user',
        content: `Generate a persona for:\n${leadInfo}`,
      },
    ],
  });

  return response.choices[0].message.content;
}
