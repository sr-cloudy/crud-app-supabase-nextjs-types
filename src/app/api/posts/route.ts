import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';
export async function GET() {
  const supabase = createClient();

  // Check session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase.from('posts').select('*');
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: Request) {
  const supabase = createClient();

  // Check session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, content } = await req.json();

  const { data, error } = await supabase
    .from('posts')
    .insert([{ title, content, user_id: user.id }])
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data[0], { status: 201 });
}
