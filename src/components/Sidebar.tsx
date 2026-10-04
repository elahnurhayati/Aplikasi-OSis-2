import React from 'react';
import { 
  LayoutDashboard, 
  Mail, 
  Target, 
  Package, 
  Wallet, 
  Users, 
  FileText, 
  HardDrive,
  MessageSquare,
  Award,
  Settings,
  School,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';
import { PengaturanMadrasah } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  counts: {
    surat: number;
    proker: number;
    inventaris: number;
    pengurus: number;
    aspirasi: number;
    sertifikat: number;
  };
  madrasahInfo: PengaturanMadrasah;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  counts,
  madrasahInfo
}) => {
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Beranda & Statistik', 
      sublabel: 'Ringkasan & Timeline',
      icon: LayoutDashboard,
      badge: 'Utama'
    },
    { 
      id: 'logos', 
      label: 'Ganti Logo Madrasah & OSIS', 
      sublabel: 'Upload & Pratinjau Logo',
      icon: ImageIcon,
      badge: 'Logo'
    },
    { 
      id: 'surat', 
      label: 'Administrasi Persuratan', 
      sublabel: 'Surat Masuk & Keluar',
      icon: Mail,
      badge: `${counts.surat}`
    },
    { 
      id: 'proker', 
      label: 'Program Kerja & LPJ', 
      sublabel: 'Progres & Anggaran LPJ',
      icon: Target,
      badge: `${counts.proker}`
    },
    { 
      id: 'inventaris', 
      label: 'Inventaris & Sarpras', 
      sublabel: 'Barang & Peminjaman',
      icon: Package,
      badge: `${counts.inventaris}`
    },
    { 
      id: 'kas', 
      label: 'Buku Kas & Keuangan', 
      sublabel: 'Kas, Kwitansi & Rekap',
      icon: Wallet,
      badge: 'Kas'
    },
    { 
      id: 'pengurus', 
      label: 'Pengurus & KTA OSIS', 
      sublabel: 'Struktur & Kartu Anggota',
      icon: Users,
      badge: `${counts.pengurus}`
    },
    { 
      id: 'notulensi', 
      label: 'Presensi & Notulensi', 
      sublabel: 'Rapat & Risalah Sidang',
      icon: FileText,
      badge: 'Notula'
    },
    { 
      id: 'aspirasi', 
      label: 'Aspirasi Suara Siswa', 
      sublabel: 'Kotak Saran & Polling',
      icon: MessageSquare,
      badge: `${counts.aspirasi}`
    },
    { 
      id: 'sertifikat', 
      label: 'Piagam & Sertifikat', 
      sublabel: 'Generator Piagam Lomba',
      icon: Award,
      badge: `${counts.sertifikat}`
    },
    { 
      id: 'drive', 
      label: 'Arsip Berkas Digital', 
      sublabel: 'Dokumen & SK Madrasah',
      icon: HardDrive,
      badge: 'Arsip'
    },
    { 
      id: 'settings', 
      label: 'Pengaturan & Backup Data', 
      sublabel: 'Profil Madrasah & Data',
      icon: Settings,
      badge: 'Setelan'
    }
  ];

  return (
    <>
      {/* Mobile Horizontal Tabs Bar */}
      <div className="md:hidden bg-[#0f172a] border-b border-slate-800 p-2 overflow-x-auto shrink-0 flex items-center gap-1.5 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:bg-[#1e293b] hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                isActive ? 'bg-black/20 text-white font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                {item.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop Vertical Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-[#0f172a] border-r border-slate-800 p-3 lg:p-4 flex-col justify-between shrink-0">
        <div className="space-y-4">
          
          {/* Official School Portal Banner */}
          <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-3.5 rounded-xl border border-slate-700/80 relative overflow-hidden group shadow-sm">
            <div className="flex items-center gap-2.5">
              <img 
                src={madrasahInfo.logoMadrasahUrl || madrasahInfo.logoUrl} 
                alt="Logo Madrasah" 
                className="w-10 h-10 rounded-full object-cover border border-emerald-400 bg-white p-0.5"
              />
              <img 
                src={madrasahInfo.logoOsisUrl || madrasahInfo.logoUrl} 
                alt="Logo OSIS" 
                className="w-10 h-10 rounded-full object-cover border border-amber-400 bg-white p-0.5"
              />
            </div>
            <div className="mt-2.5">
              <div className="text-xs font-bold text-white tracking-wide">PORTAL RESMI OSIS</div>
              <div className="text-[10px] text-blue-400 font-mono font-medium">{madrasahInfo.nama}</div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Sistem manajemen administrasi terpadu 1 tahun masa jabatan kepengurusan siswa.
            </p>
            <button
              onClick={() => setActiveTab('logos')}
              className="mt-2.5 w-full py-1.5 px-2.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 border border-blue-500/50 text-[10.5px] font-semibold text-blue-200 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
              <span>Ganti Logo Madrasah & OSIS</span>
            </button>
          </div>

          {/* Navigation items */}
          <nav className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-mono tracking-wider uppercase text-slate-400 font-semibold">
              Menu Administrasi OSIS
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-md'
                      : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    isActive
                      ? 'bg-blue-800 text-white font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Credit */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="bg-[#1e293b]/70 p-3 rounded-lg border border-slate-700/60">
            <div className="text-[9px] font-mono text-blue-400 uppercase tracking-wider">Aplikasi Dibuat Oleh</div>
            <div className="text-xs font-bold text-slate-200 mt-0.5">{madrasahInfo.creator}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{madrasahInfo.nama} • {madrasahInfo.periode}</div>
          </div>
        </div>
      </aside>
    </>
  );
};
