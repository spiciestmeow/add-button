import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const token = req.query.token;
    if (!token) return res.status(400).json({ error: 'Missing token' });

    // 1. Call the SQL function we just created to increment the view
    await supabase.rpc('increment_view', { target_token: token });

    // 2. Fetch the credentials as usual
    const { data, error } = await supabase
      .from('steamCredentials')
      .select('email,password,status,view_count')
      .eq('token', token)
      .single();

    if (error) return res.status(500).json({ error: error.message });

    // 3. Send data back to your HTML frontend
    res.status(200).json(data);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
}
