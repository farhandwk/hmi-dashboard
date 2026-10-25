import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // Membaca JSON payload dari ESP32
    const body = await request.json();
    
    // Menyimpan data ke Supabase
    const { data, error } = await supabase
      .from('production_logs')
      .insert([
        {
          operator: body.operator,
          material: body.material,
          qty: body.qty,
          status: body.status,
        }
      ]);

    if (error) throw error;

    return NextResponse.json({ message: 'Data lot berhasil disimpan!' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 });
  }
}