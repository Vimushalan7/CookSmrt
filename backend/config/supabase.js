const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

if (!url || !key) {
    console.error('❌ Supabase Config Error: Missing URL or Key');
}

const supabase = createClient(url || '', key || '');

module.exports = supabase;
