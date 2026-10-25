"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Mendefinisikan tipe data sesuai tabel Supabase
type LogProduksi = {
  id: number;
  operator: string;
  material: string;
  qty: number;
  status: string;
  created_at: string;
};

export default function Dashboard() {
  const [logs, setLogs] = useState<LogProduksi[]>([]);

  useEffect(() => {
    // 1. Mengambil data yang sudah ada saat halaman pertama kali dibuka
    const fetchAwal = async () => {
      const { data } = await supabase
        .from('production_logs')
        .select('*')
        .order('id', { ascending: false });
      
      if (data) setLogs(data);
    };
    fetchAwal();

    // 2. Membuka koneksi Realtime ke Supabase
    const channel = supabase
      .channel('realtime-produksi')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'production_logs' },
        (payload) => {
          console.log('Data baru masuk:', payload.new);
          // Menambahkan data baru langsung ke baris teratas tanpa refresh
          setLogs((prev) => [payload.new as LogProduksi, ...prev]);
        }
      )
      .subscribe();

    // Membersihkan koneksi saat halaman ditutup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="min-h-screen p-8 bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Live Monitoring Final Check</h1>
        <p className="text-slate-500 mb-8">Pembaruan data instan dari area Plating</p>

        <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-4 font-semibold">Waktu</th>
                <th className="p-4 font-semibold">Operator</th>
                <th className="p-4 font-semibold">Material</th>
                <th className="p-4 font-semibold">Qty</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm text-slate-600">
                    {new Date(log.created_at).toLocaleTimeString('id-ID')}
                  </td>
                  <td className="p-4 font-medium">{log.operator}</td>
                  <td className="p-4">{log.material}</td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                      {log.qty} Lot
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-emerald-600 font-semibold">{log.status}</span>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Belum ada data lot yang masuk hari ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}