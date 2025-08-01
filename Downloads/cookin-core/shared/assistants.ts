import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function logAssistantAction({ userPrompt, functionCall }: { userPrompt: string, functionCall: any }) {
  await supabase.from('crm_logs').insert([
    {
      description: '🤖 GPT Assistant Command Invoked',
      context: { userPrompt, functionCall },
    },
  ]);
}
