import React from 'react';
import { 
  Target, 
  Package, 
  Mail, 
  Wallet, 
  Users, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  PlusCircle, 
  CheckCircle2, 
  Award, 
  ChevronRight, 
  MessageSquare, 
  HardDrive, 
  FileCheck,
  School,
  ShieldCheck,
  TrendingUp,
  Coins
} from 'lucide-react';
import { Pengurus, Proker, InventarisItem, KasTransaksi, SuratItem, PengaturanMadrasah, AspirasiSiswa } from '../types';
import { formatRupiah } from '../utils/exportUtils';
import madrasahLogoDefault from '../assets/images/madrasah_logo_1791115779583.jpg';
import osisLogoDefault from '../assets/images/osis_logo_1791115792715.jpg';

interface DashboardViewProps {
  pengurus: Pengurus[];
  proker: Proker[];
  inventaris: InventarisItem[];
  kas: KasTransaksi[];
  surat: SuratItem[];
  aspirasi: AspirasiSiswa[];
  madrasahInfo: PengaturanMadrasah;
  setActiveTab: (tab: string) => void;
  onOpenQuickSurat: () => void;
  onOpenQuickKas: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  pengurus,
  proker,
  inventaris,
  kas,
  surat,
  aspirasi,
  madrasahInfo,
  setActiveTab,
  onOpenQuickSurat,
  onOpenQuickKas
}) => {
  const logoMadrasah = madrasahInfo.logoMadrasahUrl || madrasahLogoDefault;
  const logoOsis = madrasahInfo.logoOsisUrl || osisLogoDefault;

  // Financial calculation
  const totalPemasukan = kas
    .filter(k => k.jenis === 'Pemasukan')
    .reduce((sum, k) => sum + k.nominal, 0);
  const totalPengeluaran = kas
    .filter(k => k.jenis === 'Pengeluaran')
    .reduce((sum, k) => sum + k.nominal, 0);
  const saldoKas = totalPemasukan - totalPengeluaran;

  // Inventory calculation
  const totalBarang = inventaris.reduce((acc, curr) => acc + curr.jumlahTotal, 0);
  const totalTersedia = inventaris.reduce((acc, curr) => acc + curr.jumlahTersedia, 0);
  const totalDipinjam = totalBarang - totalTersedia;

  // Proker calculation
  const prokerSelesai = proker.filter(p => p.status === 'Selesai' || p.status === 'LPJ Dievaluasi').length;
  const prokerBerjalan = proker.filter(p => p.status === 'Sedang Berjalan').length;
  const rataRataProgres = Math.round(
    proker.reduce((acc, p) => acc + p.progres, 0) / (proker.length || 1)
  );

  // 1-Year Academic Quarters
  const quarters = [
    {
      quarter: 'Triwulan I (Juli - September)',
      status: 'Terlaksana 100%',
      active: false,
      items: ['Pelantikan Pengurus OSIS Baru', 'Rapat Kerja & Penetapan Program 1 Tahun', 'Digitalisasi Sistem Administrasi & Inventaris']
    },
    {
      quarter: 'Triwulan II (Oktober - Desember)',
      status: 'Sedang Berjalan',
      active: true,
      items: ['Latihan Dasar Kepemimpinan Siswa (LDKS)', 'PORSENI & Milad Ke-15 Madrasah', 'Laporan Evaluasi Paruh Waktu Jabatan']
    },
    {
      quarter: 'Triwulan III (Januari - Maret)',
      status: 'Mendatang',
      active: false,
      items: ['Festival Seni & Budaya Islami', 'Bakti Sosial & Santunan Ramadhan', 'Bimbingan Sukses Ujian & Literasi']
    },
    {
      quarter: 'Triwulan IV (April - Juni)',
      status: 'Perencanaan',
      active: false,
      items: ['Classmeeting Akhir Tahun Pelajaran', 'Sidang Pleno LPJ Akhir Masa Jabatan', 'Pemilihan Ketua OSIS Periode Selanjutnya']
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Official School Portal Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] p-6 lg:p-8 shadow-md">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase bg-blue-900/60 text-blue-300 border border-blue-700 rounded-full">
                Portal Manajemen Administrasi OSIS
              </span>
              <span className="text-xs text-slate-400 font-mono">Masa Bakti: {madrasahInfo.periode}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Selamat Datang di Portal Resmi OSIS {madrasahInfo.nama}
            </h2>
            
            <p className="text-sm text-slate-300 leading-relaxed">
              Sistem tata kelola mandiri selama satu tahun kepengurusan: pengelolaan surat menyurat resmi, pemantauan progres program kerja dan anggaran LPJ, sirkulasi peminjaman sarana prasarana, pembukuan kas keuangan, pencetakan KTA OSIS, aspirasi siswa, serta penerbitan piagam sertifikat kegiatan.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={onOpenQuickSurat}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Buat Surat Baru</span>
              </button>

              <button
                onClick={onOpenQuickKas}
                className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-amber-300 border border-amber-500/40 font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                <Wallet className="w-4 h-4 text-amber-400" />
                <span>Catat Kas Keuangan</span>
              </button>

              <button
                onClick={() => setActiveTab('proker')}
                className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-slate-200 border border-slate-700 text-xs rounded-xl transition-colors cursor-pointer"
              >
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Program Kerja & LPJ</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-slate-200 border border-slate-700 text-xs rounded-xl transition-colors cursor-pointer"
              >
                <School className="w-4 h-4 text-blue-400" />
                <span>Ganti Logo Madrasah & OSIS</span>
              </button>
            </div>
          </div>

          {/* Dual Emblem Badge Card */}
          <div className="hidden sm:flex flex-col items-center bg-[#0b1120]/90 p-4 rounded-xl border border-slate-700/80 text-center shrink-0 w-64 shadow-md">
            <div className="flex items-center gap-2.5 mb-2">
              <img 
                src={logoMadrasah} 
                alt="Logo Madrasah" 
                className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 bg-white p-0.5"
              />
              <img 
                src={logoOsis} 
                alt="Logo OSIS" 
                className="w-14 h-14 rounded-full object-cover border-2 border-amber-500 bg-white p-0.5"
              />
            </div>
            <div className="text-xs font-bold text-white uppercase">{madrasahInfo.nama}</div>
            <div className="text-[10px] text-blue-400 font-mono">OSIS MASA BAKTI 2026/2027</div>
            <div className="w-full border-t border-slate-800 my-2"></div>
            <div className="text-[10px] text-slate-400 font-mono">
              Sekretaris & Pengembang:
            </div>
            <div className="text-xs font-semibold text-slate-200 mt-0.5">
              {madrasahInfo.creator}
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Kas Card */}
        <div 
          onClick={() => setActiveTab('kas')}
          className="bg-[#0f172a] border border-slate-800 hover:border-blue-500/50 p-5 rounded-xl transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Kas Keuangan OSIS</span>
            <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400 group-hover:scale-110 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white group-hover:text-blue-400 transition-colors">
            {formatRupiah(saldoKas)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
            <span>Masuk: {formatRupiah(totalPemasukan)}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
          </div>
        </div>

        {/* Proker Card */}
        <div 
          onClick={() => setActiveTab('proker')}
          className="bg-[#0f172a] border border-slate-800 hover:border-emerald-500/50 p-5 rounded-xl transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Program Kerja (LPJ)</span>
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 group-hover:scale-110 transition-transform">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white group-hover:text-emerald-400 transition-colors">
            {prokerBerjalan} Berjalan / {proker.length} Misi
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
            <span>Rata-rata: {rataRataProgres}% tuntas</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Persuratan Card */}
        <div 
          onClick={() => setActiveTab('surat')}
          className="bg-[#0f172a] border border-slate-800 hover:border-purple-500/50 p-5 rounded-xl transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Administrasi Surat</span>
            <div className="p-2 rounded-lg bg-purple-950/60 text-purple-400 group-hover:scale-110 transition-transform">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white group-hover:text-purple-400 transition-colors">
            {surat.length} Surat Dinas
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
            <span>{surat.filter(s => s.jenis === 'Surat Keluar').length} Keluar • {surat.filter(s => s.jenis === 'Surat Masuk').length} Masuk</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
          </div>
        </div>

        {/* Inventaris Card */}
        <div 
          onClick={() => setActiveTab('inventaris')}
          className="bg-[#0f172a] border border-slate-800 hover:border-amber-500/50 p-5 rounded-xl transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Inventaris & Sarpras</span>
            <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400 group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white group-hover:text-amber-400 transition-colors">
            {totalBarang} Unit Total
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
            <span>{totalTersedia} Siap • {totalDipinjam} Dipinjam</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </div>

      </div>

      {/* Quarters of the Academic Year Timeline */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              TIMELINE TATA KELOLA SATU TAHUN MASA JABATAN (4 TRIWULAN)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rencana strategis dan tahapan pelaksanaan program kerja OSIS Madrasah Al-Achdan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quarters.map((q, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                q.active
                  ? 'bg-blue-950/30 border-blue-500/80 shadow-md'
                  : 'bg-[#1e293b]/50 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  q.active 
                    ? 'bg-blue-600 text-white' 
                    : idx === 0 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60' 
                      : 'bg-slate-800 text-slate-400'
                }`}>
                  {q.status}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Q{idx + 1}</span>
              </div>

              <div className="text-xs font-bold text-white mb-2">{q.quarter}</div>

              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {q.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${q.active ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
