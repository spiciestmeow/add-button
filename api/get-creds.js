import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // secret key
);

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('steamCredentials') // exact table name
      .select('*')
      .limit(1);

    if (error) throw error;

    res.status(200).json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
}
