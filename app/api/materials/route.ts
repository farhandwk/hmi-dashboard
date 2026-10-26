import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Kita hanya mengambil id dan part_name untuk menghemat RAM ESP32
    const { data, error } = await supabase
      .from('master_parts')
      .select('id, part_name');

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data material' }, { status: 500 });
  }
}