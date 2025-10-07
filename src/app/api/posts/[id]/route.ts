import { NextResponse } from 'next/server';
import { createClient } from '../../../../../lib/supabase/server';
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data, { status: 200 });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();

  const { title, content } = await req.json();
  const { data, error } = await supabase
    .from('posts')
    .update({ title, content })
    .eq('id', params.id)
    .select();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0], { status: 200 });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();

  const { error } = await supabase.from('posts').delete().eq('id', params.id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(
    { message: 'Deleted successfully' },
    { status: 200 },
  );
}
// delete
