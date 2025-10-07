import { createClient } from '../../../lib/supabase/server';

import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const signOut = async () => {
    'use server';
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="p-8 bg-white rounded-lg shadow-md text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mb-2">Welcome back!</p>
        <p className="text-gray-800 font-semibold mb-6 break-all">
          {user.email}
        </p>

        <form>
          <button
            formAction={signOut}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
