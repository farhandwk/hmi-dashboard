import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params sekarang berupa Promise
) {
  try {
    // Tunggu (await) params terbuka sebelum mengambil id
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    // Menarik 1 baris spesifik berdasarkan ID
    const { data, error } = await supabase
      .from('master_parts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Detail part tidak ditemukan' }, { status: 404 });
  }
}