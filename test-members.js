import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  console.log("Fetching members...");
  const { data, error } = await supabase.from('members').select('*');
  if (error) {
    console.error("Error fetching:", error);
  } else {
    console.log("Success! Found", data.length, "members.");
    if (data.length > 0) {
      console.log(data[0]);
    }
  }
}

testQuery();
