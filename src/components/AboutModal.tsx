import React from 'react';
import { X, CheckCircle2, ShieldCheck, Heart, Sparkles, BookOpen, School, Award, HardDrive, Mail, Package, Wallet, Users } from 'lucide-react';
import { PengaturanMadrasah } from '../types';
import madrasahLogoDefault from '../assets/images/madrasah_logo_1791115779583.jpg';
import osisLogoDefault from '../assets/images/osis_logo_1791115792715.jpg';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  madrasahInfo: PengaturanMadrasah;
}

export const AboutModal: React.FC<AboutModalProps> = ({ 
  isOpen, 
  onClose,
  madrasahInfo
}) => {
  if (!isOpen) return null;

  const logoMadrasah = madrasahInfo.logoMadrasahUrl || madrasahLogoDefault;
  const logoOsis = madrasahInfo.logoOsisUrl || osisLogoDefault;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-blue-950 via-[#0f172a] to-slate-900 border-b border-slate-800">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-black/20 hover:bg-black/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <img 
                src={logoMadrasah} 
                alt="Logo Madrasah"
                className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 bg-white p-0.5 shadow-md"
              />
              <img 
                src={logoOsis} 
                alt="Logo OSIS"
                className="w-14 h-14 rounded-full object-cover border-2 border-amber-500 bg-white p-0.5 shadow-md"
              />
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-900/60 text-blue-300 border border-blue-700 uppercase mb-1">
                Portal Manajemen Terpadu
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {madrasahInfo.nama}
              </h2>
              <p className="text-xs text-slate-300">
                Sistem Administrasi & Tata Kelola OSIS Masa Bakti {madrasahInfo.periode}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Creator Profile Box */}
          <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-4.5 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0">
                <School className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-blue-400 tracking-wider font-bold">
                  Pengembang & Arsitek Sistem
                </div>
                <div className="text-lg font-bold text-white mt-0.5">
                  {madrasahInfo.creator}
                </div>
                <div className="text-xs text-slate-300 font-medium mt-0.5">
                  {madrasahInfo.creatorRole} • {madrasahInfo.nama}
                </div>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  Aplikasi ini dirancang sebagai platform administrasi digital terpadu untuk mendukung seluruh operasional dan tata kelola OSIS Madrasah Al-Achdan selama satu tahun masa jabatan secara mandiri, akuntabel, dan 100% fungsional.
                </p>
              </div>
            </div>
          </div>

          {/* Fitur Utama List */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Cakupan Modul Aplikasi Terpadu (11 Modul):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#1e293b]/60 border border-slate-800">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Persuratan Masuk & Keluar</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#1e293b]/60 border border-slate-800">
                <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Data Pengurus & KTA OSIS</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#1e293b]/60 border border-slate-800">
                <Award className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Program Kerja & LPJ Real-Time</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#1e293b]/60 border border-slate-800">
                <Package className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Inventaris & Peminjaman Sarpras</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#1e293b]/60 border border-slate-800">
                <Wallet className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Buku Kas & Kwitansi Keuangan</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#1e293b]/60 border border-slate-800">
                <HardDrive className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Arsip Berkas & Ganti Logo</span>
              </div>
            </div>
          </div>

          {/* Legalitas Madrasah */}
          <div className="bg-[#1e293b]/40 rounded-xl p-3 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-300">{madrasahInfo.nama}</div>
              <div>NPSN: {madrasahInfo.npsn} • {madrasahInfo.yayasan}</div>
            </div>
            <div className="text-right">
              <div>Kepala Madrasah:</div>
              <div className="font-medium text-slate-300">{madrasahInfo.kepalaMadrasah}</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0b1120] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
