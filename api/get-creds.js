import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const token = req.query.token;
    if (!token) return res.status(400).json({ error: 'Missing token' });

    const { data, error } = await supabase
      .from('steamCredentials')
      .select('email,password,status') // include status
      .eq('token', token)
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
}
