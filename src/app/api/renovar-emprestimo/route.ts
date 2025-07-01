import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const novaData = searchParams.get('novaData');

  if (!id || !novaData) {
    return NextResponse.json({ error: 'Parâmetros ausentes' }, { status: 400 });
  }

  const { error } = await supabase
    .from('emprestimos')
    .update({ data_devolucao: novaData })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 