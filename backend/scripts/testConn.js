const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

(async () => {
    console.log('Testing Supabase connection to:', process.env.SUPABASE_URL);
    try {
        const { data, error } = await supabase.from('dishes').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('❌ Supabase error:', error.message, error.code);
        } else {
            console.log('✅ Connected! dishes table is accessible.');
        }
    } catch (e) {
        console.error('❌ Exception:', e.message);
    }
    process.exit(0);
})();
