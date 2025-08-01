export async function createOrUpdateContact(payload: {
  email: string;
  name?: string;
  phone?: string;
  customField?: Record<string, string>;
}) {
  const res = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GHL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  return json;
}

export async function scheduleAppointment(payload: {
  contactId: string;
  calendarId: string;
  startTime: string; // ISO
  endTime: string;   // ISO
}) {
  const res = await fetch(`https://rest.gohighlevel.com/v1/appointments/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GHL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  return json;
}
