import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  console.log('URL:', process.env.SUPABASE_URL);
  console.log('Key length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length);

  try {
    const { data, error } = await supabase
      .from('"steamCredentials"')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Data fetched:', data);
    res.status(200).json(data[0]);
  } catch (err) {
    console.error('Function error:', err);
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
}
