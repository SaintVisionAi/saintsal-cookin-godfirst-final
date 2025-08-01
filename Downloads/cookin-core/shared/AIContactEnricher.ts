import { openai } from '@/lib/openai';

export async function enrichContact(contact: {
  name: string;
  company?: string;
  bio?: string;
  job_title?: string;
}) {
  const prompt = `
Given the following contact data, enrich with:
- Persona type (e.g. "Decision Maker", "Analyst")
- Purchase Intent Score (1-10)
- Priority level
- Recommended CRM Tags

Contact:
${JSON.stringify(contact, null, 2)}
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  });

  const result = completion.choices[0]?.message?.content;
  return result;
}
