import React from 'react';
import { 
  Printer, 
  Info,
  Calendar,
  Settings,
  ShieldCheck,
  School
} from 'lucide-react';
import { PengaturanMadrasah } from '../types';

interface HeaderProps {
  activeTab: string;
  onOpenAbout: () => void;
  onQuickPrint: () => void;
  onOpenSettings: () => void;
  madrasahInfo: PengaturanMadrasah;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onOpenAbout, 
  onQuickPrint,
  onOpenSettings,
  madrasahInfo
}) => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-2.5 transition-all shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Zone 1: Dual Logos & School Brand */}
        <div className="flex items-center gap-3">
          {/* Logo Madrasah */}
          <div className="relative group shrink-0">
            <img 
              src={madrasahInfo.logoMadrasahUrl || madrasahInfo.logoUrl} 
              alt="Logo Madrasah Al-Achdan" 
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-sm bg-white p-0.5 group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Logo OSIS */}
          <div className="relative group shrink-0 hidden sm:block">
            <img 
              src={madrasahInfo.logoOsisUrl || madrasahInfo.logoUrl} 
              alt="Logo OSIS Nasional" 
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-500 shadow-sm bg-white p-0.5 group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                OSIS AL-ACHDAN
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded-full">
                Sistem Terpadu
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate hidden md:block">
              {madrasahInfo.nama} • {madrasahInfo.periode}
            </p>
          </div>
        </div>

        {/* Zone 2: Date metadata */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300 bg-[#1e293b] px-3.5 py-1.5 rounded-lg border border-slate-700/80">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>{currentDate}</span>
          <span className="text-slate-600">·</span>
          <span className="text-emerald-400 font-medium">Aktif Jabatan 1 Tahun</span>
        </div>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onQuickPrint}
            title="Cetak Halaman Ini"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-[#1e293b] hover:bg-[#334155] border border-slate-700 rounded-lg transition-colors cursor-pointer shadow-sm hover:text-white"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Cetak Dokumen</span>
          </button>

          <button
            onClick={onOpenSettings}
            title="Pengaturan Madrasah & Ganti Logo"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-[#1e293b] hover:bg-[#334155] border border-amber-500/40 rounded-lg transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ganti Logo & Profil</span>
          </button>

          <button
            onClick={onOpenAbout}
            title="Informasi Pengembang & Madrasah"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all cursor-pointer shadow-sm"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tentang</span>
          </button>
        </div>
      </div>
    </header>
  );
};
