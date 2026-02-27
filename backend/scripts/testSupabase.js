const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function test() {
    console.log('Connecting to:', process.env.SUPABASE_URL);
    const { data, error } = await supabase.from('dishes').select('count', { count: 'exact', head: true });
    if (error) {
        console.error('Connection failed:', error);
    } else {
        console.log('Connection successful! Table "dishes" exists.');
    }
}

test();
