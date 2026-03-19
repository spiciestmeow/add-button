import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const token = req.query.token; // ?token=xxx
    if (!token) return res.status(400).json({ error: 'Missing token' });

    const { data, error } = await supabase
      .from('steamCredentials')
      .select('email,password')
      .eq('token', token)
      .single(); // fetch only one row

    if (error) return res.status(404).json({ error: 'Invalid token' });

    res.status(200).json(data);
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
}
