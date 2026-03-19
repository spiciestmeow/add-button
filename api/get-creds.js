import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const id = req.query.id; // get ?id=1 from the URL
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const { data, error } = await supabase
      .from('steamCredentials')
      .select('email,password')
      .eq('id', id)
      .single(); // only fetch one row

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Function error:', err);
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
}
