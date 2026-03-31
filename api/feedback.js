import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const { token, feedback } = req.query;

    if (!token || !feedback) {
      return res.status(400).json({ error: 'Missing data' });
    }

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.socket?.remoteAddress ||
      'unknown';

    const userAgent = req.headers['user-agent'] || 'unknown';

    const { error } = await supabase.from('feedback_logs').insert({
      ip,
      token,
      feedback,
      user_agent: userAgent
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
