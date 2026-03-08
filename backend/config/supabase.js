const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

let supabase;

if (!url || !key) {
    console.error('❌ Supabase Config Error: Missing URL or Key. Database features will fail.');
    // Create a dummy client that returns errors instead of crashing the process
    supabase = {
        from: () => ({
            select: () => ({ order: () => Promise.resolve({ data: [], error: { message: 'Database not configured' } }) }),
            insert: () => Promise.resolve({ data: null, error: { message: 'Database not configured' } }),
            update: () => Promise.resolve({ data: null, error: { message: 'Database not configured' } }),
            delete: () => Promise.resolve({ error: { message: 'Database not configured' } }),
            eq: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: { message: 'Database not configured' } }), single: () => Promise.resolve({ data: null, error: { message: 'Database not configured' } }) })
        }),
        auth: {
            getUser: () => Promise.resolve({ data: { user: null }, error: null })
        }
    };
} else {
    try {
        supabase = createClient(url, key);
    } catch (err) {
        console.error('❌ Supabase Init Error:', err.message);
        supabase = { from: () => ({ select: () => Promise.resolve({ data: [], error: err }) }) };
    }
}

module.exports = supabase;
