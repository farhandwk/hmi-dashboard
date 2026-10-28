import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // Membaca payload JSON dari ESP32
    const body = await request.json();
    const { operator_id, part_id, qty, status } = body;

    // Insert ke tabel khusus HMI yang baru saja dibuat
    const { data, error } = await supabase
      .from('hmi_production_logs')
      .insert([{ operator_id, part_id, qty, status }])
      .select()
      .single();

    if (error) throw error;

    // Mengembalikan status 201 Created jika berhasil masuk DB
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mencatat lot produksi HMI' }, { status: 500 });
  }
}