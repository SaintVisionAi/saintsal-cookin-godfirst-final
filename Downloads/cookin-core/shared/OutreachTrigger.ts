import { createClient } from '@supabase/supabase-js';
import { sendMessage } from '@/lib/messaging';
import { logCrmEvent } from '@/lib/logCrmEvent';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function triggerOutreach(lead: any) {
  const message = `🚀 Outreach Triggered for ${lead.name}\n\n` +
                  `📊 Score: ${lead.score}\n` +
                  `🎯 Priority: ${lead.priority}\n\n` +
                  `✉️ Message: ${lead.message}`;

  const result = await sendMessage({
    to: lead.phone || lead.email,
    content: message,
  });

  await logCrmEvent({
    description: `🚀 Outreach Message Sent to ${lead.name}`,
    context: { lead, result },
    user_id: lead.user_id,
  });

  return result;
}
