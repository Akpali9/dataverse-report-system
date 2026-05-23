// app/layout.js
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function RootLayout({ children }) {
  // This ensures Supabase is properly initialized
  const supabase = createServerComponentClient({ cookies });
  
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
