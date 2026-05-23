// app/debug/page.js
'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr'; // ✅ Correct import

export default function DebugPage() {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        
        // Test 1: Check auth
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        console.log('Auth:', session ? 'Logged in' : 'Not logged in');
        
        // Test 2: Test RLS policies
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*')
          .limit(1);
        
        if (usersError) throw usersError;
        
        setData({ success: true, users: users?.length });
      } catch (err) {
        console.error('Debug error:', err);
        setError(err.message);
      }
    }
    
    testConnection();
  }, []);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div>Testing connection...</div>;
  return <div className="text-green-500">Connection successful!</div>;
}
