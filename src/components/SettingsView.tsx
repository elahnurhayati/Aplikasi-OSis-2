import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Database, 
  Upload, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  School, 
  FileText,
  UserCheck,
  Image as ImageIcon,
  RefreshCw,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { PengaturanMadrasah } from '../types';
import { fileToBase64 } from '../utils/exportUtils';
import madrasahLogoDefault from '../assets/images/madrasah_logo_1791115779583.jpg';
import osisLogoDefault from '../assets/images/osis_logo_1791115792715.jpg';

interface SettingsViewProps {
  madrasahInfo: PengaturanMadrasah;
  onUpdateMadrasahInfo: (info: PengaturanMadrasah) => void;
  onBackupJson: () => void;
  onRestoreJson: (jsonData: any) => void;
  onResetDefault: () => void;
  initialTab?: 'logos' | 'profile' | 'backup' | 'system';
  counts: {
    pengurus: number;
    surat: number;
    proker: number;
    inventaris: number;
    kas: number;
    notulensi: number;
    berkas: number;
    aspirasi: number;
    sertifikat: number;
  };
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  madrasahInfo,
  onUpdateMadrasahInfo,
  onBackupJson,
  onRestoreJson,
  onResetDefault,
  initialTab = 'logos',
  counts
}) => {
  const [formData, setFormData] = useState<PengaturanMadrasah>({ 
    ...madrasahInfo,
    logoMadrasahUrl: madrasahInfo.logoMadrasahUrl || madrasahLogoDefault,
    logoOsisUrl: madrasahInfo.logoOsisUrl || osisLogoDefault
  });

  const [activeTab, setActiveTab] = useState<'logos' | 'profile' | 'backup' | 'system'>(initialTab);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<string>('');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    setFormData({
      ...madrasahInfo,
      logoMadrasahUrl: madrasahInfo.logoMadrasahUrl || madrasahLogoDefault,
      logoOsisUrl: madrasahInfo.logoOsisUrl || osisLogoDefault
    });
  }, [madrasahInfo]);

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateMadrasahInfo(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Upload handler for Logo Madrasah
  const handleUploadLogoMadrasah = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      const updated = { 
        ...formData, 
        logoMadrasahUrl: base64,
        logoUrl: base64 
      };
      setFormData(updated);
      onUpdateMadrasahInfo(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Gagal membaca gambar logo madrasah:', err);
    }
  };

  // Upload handler for Logo OSIS
  const handleUploadLogoOsis = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      const updated = { 
        ...formData, 
        logoOsisUrl: base64 
      };
      setFormData(updated);
      onUpdateMadrasahInfo(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Gagal membaca gambar logo OSIS:', err);
    }
  };

  const handleResetMadrasahLogo = () => {
    const updated = {
      ...formData,
      logoMadrasahUrl: madrasahLogoDefault,
      logoUrl: madrasahLogoDefault
    };
    setFormData(updated);
    onUpdateMadrasahInfo(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetOsisLogo = () => {
    const updated = {
      ...formData,
      logoOsisUrl: osisLogoDefault
    };
    setFormData(updated);
    onUpdateMadrasahInfo(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && (parsed.pengurus || parsed.surat || parsed.proker)) {
          if (window.confirm('File cadangan valid terdeteksi! Yakin ingin memulihkan seluruh data dari file ini? Data yang ada akan diperbarui.')) {
            onRestoreJson(parsed);
            setRestoreStatus('Data berhasil dipulihkan dari cadangan!');
            setTimeout(() => setRestoreStatus(''), 4000);
          }
        } else {
          alert('Format file JSON tidak cocok dengan struktur cadangan OSIS Al-Achdan.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON. Pastikan file valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            PENGATURAN LOGO & SISTEM ADMINISTRASI OSIS
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ganti logo madrasah & logo OSIS, profil lembaga, kop surat resmi, serta ekspor & impor cadangan data
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('logos')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'logos'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#1e293b] text-slate-300 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
            <span>Ganti Logo</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#1e293b] text-slate-300 hover:text-white'
            }`}
          >
            Profil Madrasah
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'backup'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#1e293b] text-slate-300 hover:text-white'
            }`}
          >
            Backup & Restore
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'system'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#1e293b] text-slate-300 hover:text-white'
            }`}
          >
            Status Basis Data
          </button>
        </div>
      </div>

      {/* TAB 1: MENU GANTI LOGO MADRASAH & OSIS */}
      {activeTab === 'logos' && (
        <div className="space-y-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                  PENGATURAN LOGO RESMI MADRASAH & LOGO OSIS
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Logo yang diunggah akan otomatis ditampilkan pada Header aplikasi, Kop Surat Resmi (kiri & kanan), Kartu Tanda Anggota (KTA), dan Piagam Penghargaan.
                </p>
              </div>

              {saveSuccess && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-600 rounded-lg text-xs font-bold animate-pulse">
                  <CheckCircle2 className="w-4 h-4" />
                  Logo Berhasil Disimpan!
                </span>
              )}
            </div>

            {/* Dual Logo Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* CARD 1: LOGO MADRASAH */}
              <div className="bg-[#1e293b]/70 border border-slate-700/80 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <School className="w-4 h-4" />
                    1. Logo Madrasah / Sekolah
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Sisi Kiri Kop Surat</span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-[#0f172a] rounded-xl border border-slate-800">
                  <img 
                    src={formData.logoMadrasahUrl || madrasahLogoDefault} 
                    alt="Pratinjau Logo Madrasah" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/80 bg-white p-1 shadow-md mb-2"
                  />
                  <div className="text-xs font-semibold text-white">{formData.nama}</div>
                  <div className="text-[10px] text-slate-400">{formData.yayasan}</div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Unggah File Logo Baru (PNG / JPG / SVG / WebP):
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadLogoMadrasah}
                      className="w-full text-xs text-slate-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer bg-[#0f172a] p-1 rounded-lg border border-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Atau Tempel Tautan Gambar Logo (URL):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formData.logoMadrasahUrl}
                        onChange={(e) => setFormData({ ...formData, logoMadrasahUrl: e.target.value })}
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveProfile()}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
                      >
                        Terapkan
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetMadrasahLogo}
                    className="w-full py-1.5 bg-[#0f172a] hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Gunakan Logo Default Madrasah Al-Achdan</span>
                  </button>
                </div>
              </div>

              {/* CARD 2: LOGO OSIS */}
              <div className="bg-[#1e293b]/70 border border-slate-700/80 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    2. Logo Resmi OSIS
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Sisi Kanan Kop Surat & KTA</span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-[#0f172a] rounded-xl border border-slate-800">
                  <img 
                    src={formData.logoOsisUrl || osisLogoDefault} 
                    alt="Pratinjau Logo OSIS" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-amber-500/80 bg-white p-1 shadow-md mb-2"
                  />
                  <div className="text-xs font-semibold text-white">ORGANISASI SISWA INTRA SEKOLAH</div>
                  <div className="text-[10px] text-slate-400">Masa Bakti: {formData.periode}</div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Unggah File Logo OSIS Baru (PNG / JPG / SVG / WebP):
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadLogoOsis}
                      className="w-full text-xs text-slate-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer bg-[#0f172a] p-1 rounded-lg border border-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Atau Tempel Tautan Gambar Logo (URL):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formData.logoOsisUrl}
                        onChange={(e) => setFormData({ ...formData, logoOsisUrl: e.target.value })}
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveProfile()}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
                      >
                        Terapkan
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetOsisLogo}
                    className="w-full py-1.5 bg-[#0f172a] hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Gunakan Logo Default OSIS Nasional</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Pratinjau Tampilan Kop Surat dengan Kedua Logo */}
            <div className="p-4 bg-white text-slate-900 rounded-xl border border-slate-300 shadow">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-center mb-2">
                — SIMULASI KOP SURAT RESMI (HASIL CETAK KERTAS A4) —
              </div>
              <div className="border-b-[3px] border-double border-black pb-3 flex items-center justify-between gap-4 text-center">
                <img 
                  src={formData.logoMadrasahUrl || madrasahLogoDefault} 
                  alt="Logo Madrasah" 
                  className="w-14 h-14 object-cover rounded-full border border-slate-400 shrink-0"
                />
                <div className="flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    KEMENTERIAN AGAMA REPUBLIK INDONESIA
                  </div>
                  <div className="text-xs font-extrabold uppercase text-slate-950 font-serif">
                    {formData.nama}
                  </div>
                  <div className="text-[11px] font-bold uppercase text-slate-900 font-sans">
                    ORGANISASI SISWA INTRA SEKOLAH (OSIS)
                  </div>
                  <div className="text-[9px] text-slate-600 mt-0.5">
                    {formData.alamat} | Telp: {formData.telepon} | Email: {formData.email}
                  </div>
                </div>
                <img 
                  src={formData.logoOsisUrl || osisLogoDefault} 
                  alt="Logo OSIS" 
                  className="w-14 h-14 object-cover rounded-full border border-slate-400 shrink-0"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => handleSaveProfile()}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Seluruh Pengaturan Logo</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Profil Madrasah & Kop Surat */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <School className="w-4 h-4 text-blue-400" />
                INFORMASI LEMBAGA & KOP SURAT RESMI
              </h3>
              <p className="text-xs text-slate-400">
                Informasi ini akan tercetak otomatis pada seluruh kop surat, LPJ, kwitansi, dan piagam
              </p>
            </div>

            {saveSuccess && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded-lg text-xs font-bold animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                Pengaturan Tersimpan!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nama Madrasah
              </label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Lembaga / Yayasan Penaung
              </label>
              <input
                type="text"
                required
                value={formData.yayasan}
                onChange={(e) => setFormData({ ...formData, yayasan: e.target.value })}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nomor Pokok Sekolah Nasional (NPSN)
              </label>
              <input
                type="text"
                value={formData.npsn}
                onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nomor Telepon Sekretariat
              </label>
              <input
                type="text"
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Alamat Lengkap Madrasah
              </label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Resmi Madrasah / OSIS
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Periode Masa Jabatan
              </label>
              <input
                type="text"
                value={formData.periode}
                onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
              Pejabat Penandatangan Resmi Surat & Dokumen
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Kepala Madrasah
                </label>
                <input
                  type="text"
                  value={formData.kepalaMadrasah}
                  onChange={(e) => setFormData({ ...formData, kepalaMadrasah: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  NIP Kepala Madrasah
                </label>
                <input
                  type="text"
                  value={formData.nipKepala}
                  onChange={(e) => setFormData({ ...formData, nipKepala: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Pembina OSIS
                </label>
                <input
                  type="text"
                  value={formData.pembinaOsis}
                  onChange={(e) => setFormData({ ...formData, pembinaOsis: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Ketua Umum OSIS
                </label>
                <input
                  type="text"
                  value={formData.ketuaOsis}
                  onChange={(e) => setFormData({ ...formData, ketuaOsis: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
              Identitas Pembuat & Pengembang Aplikasi
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Pembuat Aplikasi
                </label>
                <input
                  type="text"
                  value={formData.creator}
                  onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Peran / Jabatan Pembuat
                </label>
                <input
                  type="text"
                  value={formData.creatorRole}
                  onChange={(e) => setFormData({ ...formData, creatorRole: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil Lembaga</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Backup & Restore */}
      {activeTab === 'backup' && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              PUSAT PENCADANGAN & PEMULIHAN BASIS DATA
            </h3>
            <p className="text-xs text-slate-400">
              Amankan seluruh berkas administrasi OSIS (pengurus, surat, proker, inventaris, kas, notulensi, aspirasi, sertifikat) dalam 1 file JSON
            </p>
          </div>

          {restoreStatus && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-600 text-emerald-300 rounded-xl text-xs flex items-center gap-2 font-bold animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              <span>{restoreStatus}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Box 1: Ekspor Cadangan */}
            <div className="bg-[#1e293b]/70 border border-slate-700/80 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-white mb-1">
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>Cadangkan Seluruh Data (Ekspor JSON)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Menghasilkan 1 file cadangan lengkap yang memuat seluruh entitas administrasi OSIS. Simpan file ini di Google Drive, flashdisk, atau komputer sekolah secara berkala.
                </p>
              </div>

              <button
                type="button"
                onClick={onBackupJson}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Cadangan Lengkap (.JSON)</span>
              </button>
            </div>

            {/* Box 2: Impor Cadangan */}
            <div className="bg-[#1e293b]/70 border border-slate-700/80 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-white mb-1">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Pulihkan Data dari File Cadangan (Impor JSON)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pilih file JSON hasil ekspor sebelumnya untuk memulihkan seluruh catatan pengurus, kas, persuratan, dan inventaris secara instan.
                </p>
              </div>

              <label className="w-full py-2.5 bg-[#0f172a] hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 text-center">
                <Upload className="w-4 h-4" />
                <span>Pilih File Cadangan JSON</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset Pabrik */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between p-4 bg-rose-950/20 rounded-xl border border-rose-900/30">
            <div>
              <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Reset Seluruh Data ke Setelan Awal Pabrik
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tindakan ini akan mengosongkan perubahan lokal dan mengembalikan data percontohan resmi default.
              </p>
            </div>

            <button
              type="button"
              onClick={onResetDefault}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shrink-0"
            >
              Reset Data
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Status Basis Data */}
      {activeTab === 'system' && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              STATUS REKAPITULASI ENTITAS BASIS DATA OSIS
            </h3>
            <p className="text-xs text-slate-400">
              Seluruh data tersimpan secara aman di penyimpanan peramban lokal (Local Storage) dan siap digunakan offline
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-[#1e293b] rounded-xl border border-slate-700">
              <span className="text-slate-400">Pengurus OSIS</span>
              <div className="text-lg font-bold text-white mt-1">{counts.pengurus} Anggota</div>
            </div>
            <div className="p-3 bg-[#1e293b] rounded-xl border border-slate-700">
              <span className="text-slate-400">Surat Keluar / Masuk</span>
              <div className="text-lg font-bold text-blue-400 mt-1">{counts.surat} Berkas</div>
            </div>
            <div className="p-3 bg-[#1e293b] rounded-xl border border-slate-700">
              <span className="text-slate-400">Program Kerja (LPJ)</span>
              <div className="text-lg font-bold text-amber-400 mt-1">{counts.proker} Misi</div>
            </div>
            <div className="p-3 bg-[#1e293b] rounded-xl border border-slate-700">
              <span className="text-slate-400">Aset Inventaris</span>
              <div className="text-lg font-bold text-emerald-400 mt-1">{counts.inventaris} Unit</div>
            </div>
            <div className="p-3 bg-[#1e293b] rounded-xl border border-slate-700">
              <span className="text-slate-400">Transaksi Kas</span>
              <div className="text-lg font-bold text-white mt-1">{counts.kas} Mutasi</div>
            </div>
            <div className="p-3 bg-[#1e293b] rounded-xl border border-slate-700">
              <span className="text-slate-400">Notulensi Sidang</span>
              <div className="text-lg font-bold text-blue-400 mt-1">{counts.notulensi} Rapat</div>
            </div>
            <div className="p-3 bg-[#1e293b] rounded-xl border border-slate-700">
              <span className="text-slate-400">Suara / Aspirasi Siswa</span>
              <div className="text-lg font-bold text-purple-400 mt-1">{counts.aspirasi} Aspirasi</div>
            </div>
            <div className="p-3 bg-[#1e293b] rounded-xl border border-slate-700">
              <span className="text-slate-400">Piagam & Sertifikat</span>
              <div className="text-lg font-bold text-amber-300 mt-1">{counts.sertifikat} Piagam</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
