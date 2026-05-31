export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { user_id } = req.body || {};
  if (!user_id) {
    return res.status(400).json({ ok: false, error: 'user_id kerak' });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHANNEL_ID = process.env.CHANNEL_ID;

  if (!BOT_TOKEN || !CHANNEL_ID) {
    return res.status(500).json({ ok: false, error: 'Server sozlanmagan' });
  }

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${encodeURIComponent(CHANNEL_ID)}&user_id=${user_id}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.ok) {
      return res.status(200).json({ ok: false, subscribed: false, error: data.description });
    }

    const status = data.result?.status;
    const subscribed = ['member', 'administrator', 'creator'].includes(status);
    return res.status(200).json({ ok: true, subscribed, status });

  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Server xatosi: ' + err.message });
  }
}
