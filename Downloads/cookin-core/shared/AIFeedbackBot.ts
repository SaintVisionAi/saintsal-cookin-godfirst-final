import { openai } from '@/lib/openai';

export async function processFeedback(feedback: string) {
  const prompt = `
You're an AI assistant helping organize CRM feedback.

Given the following raw feedback, create a structured summary with:
- Summary
- Suggested Actions
- Tags
- Priority (Low/Medium/High)

Feedback:
"""${feedback}"""
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  });

  const result = completion.choices[0]?.message?.content;
  return result;
}
