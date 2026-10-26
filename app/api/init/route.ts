import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Baris "export const dynamic = ..." sudah dihapus

export async function GET(request: Request) { // Tambahkan parameter request disini
  try {
    // Menarik data operator yang aktif
    const { data: operators, error: errOp } = await supabase
      .from('master_operators')
      .select('id, operator_name')
      .eq('is_active', true)
      .order('id', { ascending: true });

    // Menarik id dan part_name saja untuk menghemat RAM ESP32
    const { data: parts, error: errPart } = await supabase
      .from('master_parts')
      .select('id, part_name');

    if (errOp || errPart) throw new Error('Gagal mengambil data dari database');

    return NextResponse.json({ operators, parts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal inisialisasi data' }, { status: 500 });
  }
}