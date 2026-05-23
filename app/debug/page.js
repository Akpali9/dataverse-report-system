// app/test/page.js
'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function TestPage() {
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function test() {
      try {
        // Check if env vars exist
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
          throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
        }
        if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
        }

        setStatus('Creating Supabase client...');
        
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        setStatus('Testing connection...');
        
        // Simple test query
        const { error: testError } = await supabase
          .from('users')
          .select('count', { count: 'exact', head: true });
        
        if (testError) throw testError;
        
        setStatus('✅ Connected successfully!');
      } catch (err) {
        console.error('Test error:', err);
        setError(err.message);
        setStatus('❌ Connection failed');
      }
    }
    
    test();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      <div className={`p-4 rounded ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
        <p className="font-semibold">Status: {status}</p>
        {error && <p className="mt-2 text-sm">Error: {error}</p>}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Environment Variables Check:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
          <li>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</li>
        </ul>
      </div>
    </div>
  );
}
