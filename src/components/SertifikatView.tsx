import React, { useState } from 'react';
import { 
  Award, 
  Plus, 
  Printer, 
  Download, 
  Search, 
  Star, 
  CheckCircle2, 
  Sparkles,
  FileCheck2,
  X,
  School,
  ShieldCheck
} from 'lucide-react';
import { SertifikatItem, PengaturanMadrasah } from '../types';
import { DocumentData } from './DocumentPrintModal';
import madrasahLogoDefault from '../assets/images/madrasah_logo_1791115779583.jpg';
import osisLogoDefault from '../assets/images/osis_logo_1791115792715.jpg';

interface SertifikatViewProps {
  sertifikatList: SertifikatItem[];
  onAddSertifikat: (item: SertifikatItem) => void;
  onPreviewPrint: (doc: DocumentData) => void;
  madrasahInfo: PengaturanMadrasah;
}

export const SertifikatView: React.FC<SertifikatViewProps> = ({
  sertifikatList,
  onAddSertifikat,
  onPreviewPrint,
  madrasahInfo
}) => {
  const [selectedSertifikat, setSelectedSertifikat] = useState<SertifikatItem>(sertifikatList[0] || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const logoMadrasah = madrasahInfo.logoMadrasahUrl || madrasahLogoDefault;
  const logoOsis = madrasahInfo.logoOsisUrl || osisLogoDefault;

  // Form State
  const [formData, setFormData] = useState<Partial<SertifikatItem>>({
    nomorSertifikat: `09${sertifikatList.length + 1}/SERT-ACHDAN/X/2026`,
    namaPenerima: '',
    nisn: '',
    kelas: 'XI MIPA 1',
    peranSebagai: 'Peserta Berprestasi',
    namaKegiatan: 'PORSENI & Milad Ke-15 Madrasah Al-Achdan',
    tanggalTerbit: new Date().toISOString().split('T')[0],
    deskripsiPrestasi: 'Atas partisipasi aktif, dedikasi, serta sportivitas tinggi yang ditunjukkan dalam rangkaian perhelatan akbar Madrasah Al-Achdan.',
    penandatangan1: madrasahInfo.kepalaMadrasah,
    penandatangan2: madrasahInfo.ketuaOsis
  });

  const handlePrintSertifikat = (s: SertifikatItem) => {
    const certHtml = `
      <div style="font-family: 'Times New Roman', serif; text-align: center; padding: 25pt; border: 8px double #1e3a8a; background: #FFFDF9; color: #1a1a1a; box-sizing: border-box; position: relative;">
        <!-- Dual Logos on Certificate -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12pt; border-bottom: 2px solid #cbd5e1; padding-bottom: 10pt;">
          <img src="${logoMadrasah}" style="width: 70px; height: 70px; border-radius: 50%; border: 2px solid #059669; object-fit: contain;" />
          <div style="flex: 1; padding: 0 15pt;">
            <div style="font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; color: #475569;">
              ${madrasahInfo.yayasan}
            </div>
            <div style="font-family: Arial, sans-serif; font-size: 14pt; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #0f172a; margin-top: 2pt;">
              ${madrasahInfo.nama}
            </div>
            <div style="font-size: 8.5pt; color: #64748b; font-family: Arial, sans-serif;">
              ${madrasahInfo.alamat}
            </div>
          </div>
          <img src="${logoOsis}" style="width: 70px; height: 70px; border-radius: 50%; border: 2px solid #d97706; object-fit: contain;" />
        </div>

        <h1 style="font-family: Georgia, serif; font-size: 26pt; font-weight: bold; color: #1e3a8a; margin: 15pt 0 0 0; letter-spacing: 3px; text-transform: uppercase;">
          PIAGAM PENGHARGAAN
        </h1>
        <div style="font-size: 10pt; font-family: monospace; color: #64748b; margin-top: 3pt;">
          Nomor: ${s.nomorSertifikat}
        </div>

        <p style="font-size: 11pt; margin-top: 15pt; font-style: italic;">
          Dengan penuh rasa bangga dan apresiasi setinggi-tingginya, piagam ini dianugerahkan kepada:
        </p>

        <div style="font-size: 22pt; font-weight: bold; color: #0f172a; text-decoration: underline; margin: 10pt 0 5pt 0; font-family: Georgia, serif;">
          ${s.namaPenerima}
        </div>
        <div style="font-size: 11pt; color: #475569; font-family: Arial, sans-serif;">
          ${s.nisn ? `NISN: ${s.nisn} · ` : ''}${s.kelas ? `Kelas: ${s.kelas}` : ''}
        </div>

        <p style="font-size: 12pt; margin-top: 12pt;">
          Sebagai: <strong style="color: #0284c7; font-size: 14pt; text-transform: uppercase;">${s.peranSebagai}</strong>
        </p>

        <p style="font-size: 12pt; font-weight: bold; color: #1e293b; margin-top: 4pt;">
          Dalam Agenda: "${s.namaKegiatan}"
        </p>

        <p style="font-size: 10.5pt; max-width: 550px; margin: 10pt auto; color: #334155; line-height: 1.5; font-style: italic;">
          "${s.deskripsiPrestasi}"
        </p>

        <!-- Tanda Tangan Dual -->
        <table style="width: 100%; margin-top: 25pt; border-collapse: collapse; border: none;">
          <tr>
            <td style="width: 50%; text-align: center; border: none; font-family: Arial, sans-serif; font-size: 10pt;">
              <div>Mengetahui,</div>
              <div style="font-weight: bold;">Kepala ${madrasahInfo.nama}</div>
              <div style="height: 50px;"></div>
              <div style="font-weight: bold; text-decoration: underline;">${s.penandatangan1}</div>
              <div style="font-size: 8.5pt; color: #64748b;">NIP: ${madrasahInfo.nipKepala}</div>
            </td>
            <td style="width: 50%; text-align: center; border: none; font-family: Arial, sans-serif; font-size: 10pt;">
              <div>Jawa Barat, ${s.tanggalTerbit}</div>
              <div style="font-weight: bold;">Ketua Umum OSIS</div>
              <div style="height: 50px;"></div>
              <div style="font-weight: bold; text-decoration: underline;">${s.penandatangan2}</div>
              <div style="font-size: 8.5pt; color: #64748b;">NISN: 0078129340</div>
            </td>
          </tr>
        </table>
      </div>
    `;

    onPreviewPrint({
      title: `Piagam Penghargaan - ${s.namaPenerima}`,
      tanggal: s.tanggalTerbit,
      perihal: `Piagam ${s.peranSebagai} - ${s.namaPenerima}`,
      contentHtml: certHtml
    });
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaPenerima || !formData.namaKegiatan) return;

    const newSert: SertifikatItem = {
      id: `sert-${Date.now()}`,
      nomorSertifikat: formData.nomorSertifikat || `09${sertifikatList.length + 1}/SERT-ACHDAN/X/2026`,
      namaPenerima: formData.namaPenerima,
      nisn: formData.nisn || '',
      kelas: formData.kelas || '',
      peranSebagai: formData.peranSebagai as any || 'Peserta Berprestasi',
      namaKegiatan: formData.namaKegiatan,
      tanggalTerbit: formData.tanggalTerbit || new Date().toISOString().split('T')[0],
      deskripsiPrestasi: formData.deskripsiPrestasi || 'Atas dedikasi dan prestasi luar biasa.',
      penandatangan1: madrasahInfo.kepalaMadrasah,
      penandatangan2: madrasahInfo.ketuaOsis
    };

    onAddSertifikat(newSert);
    setSelectedSertifikat(newSert);
    setIsAddModalOpen(false);
  };

  const filteredList = sertifikatList.filter(s =>
    s.namaPenerima.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.namaKegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nomorSertifikat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            GENERATOR PIAGAM PENGHARGAAN & SERTIFIKAT RESMI
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cetak piagam kejuaraan lomba, apresiasi kepanitiaan, dan sertifikat pengurus berdedikasi tinggi dengan dual logo resmi
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Terbitkan Piagam Baru</span>
        </button>
      </div>

      {/* Main Spotlight Preview */}
      {selectedSertifikat && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-md">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Visual Mini Frame */}
            <div className="w-full max-w-lg p-6 rounded-xl border-4 border-double border-blue-900 bg-[#FFFDF7] text-slate-900 shadow-xl text-center select-none">
              <div className="flex items-center justify-between mb-2 px-2">
                <img src={logoMadrasah} alt="Logo Madrasah" className="w-10 h-10 object-contain rounded-full" />
                <div className="text-[10px] font-mono tracking-widest text-blue-900 font-bold uppercase">
                  {madrasahInfo.nama}
                </div>
                <img src={logoOsis} alt="Logo OSIS" className="w-10 h-10 object-contain rounded-full" />
              </div>
              <h3 className="text-lg font-bold font-serif text-slate-900 mt-1">
                PIAGAM PENGHARGAAN
              </h3>
              <div className="text-[9px] font-mono text-slate-500">{selectedSertifikat.nomorSertifikat}</div>

              <div className="my-3 text-xs italic text-slate-600">Diberikan Kepada:</div>
              <div className="text-lg font-bold font-serif underline text-blue-950">
                {selectedSertifikat.namaPenerima}
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                {selectedSertifikat.peranSebagai} • {selectedSertifikat.namaKegiatan}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-300 flex justify-between text-[8px] font-sans text-slate-600">
                <span>Kepala: {madrasahInfo.kepalaMadrasah}</span>
                <span>Ketua OSIS: {madrasahInfo.ketuaOsis}</span>
              </div>
            </div>

            {/* Actions & Detail */}
            <div className="space-y-4 max-w-md">
              <div>
                <span className="text-xs font-mono text-blue-400 uppercase">Sertifikat Aktif</span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedSertifikat.namaPenerima}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {selectedSertifikat.peranSebagai} pada {selectedSertifikat.namaKegiatan}
                </p>
              </div>

              <p className="text-xs text-slate-400 italic bg-[#1e293b] p-3 rounded-xl border border-slate-700">
                "{selectedSertifikat.deskripsiPrestasi}"
              </p>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => handlePrintSertifikat(selectedSertifikat)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Unduh PDF Piagam</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Grid of All Certificates */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            ARSIP PIAGAM & SERTIFIKAT TERBIT ({sertifikatList.length} DOKUMEN)
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari penerima / kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((item) => {
            const isSelected = selectedSertifikat?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedSertifikat(item)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-[#1e293b] border-blue-500 shadow-md ring-1 ring-blue-500' 
                    : 'bg-[#0f172a] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                    <span>{item.nomorSertifikat}</span>
                    <span>{item.tanggalTerbit}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {item.namaPenerima}
                  </h4>
                  <div className="text-xs text-blue-400 font-medium mt-0.5">
                    {item.peranSebagai}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {item.namaKegiatan}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {item.kelas || 'Siswa'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrintSertifikat(item);
                    }}
                    className="p-1.5 bg-[#1e293b] hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700 cursor-pointer"
                    title="Cetak Piagam"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Terbitkan Piagam Penghargaan Baru
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNew} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  placeholder="Nama Lengkap Siswa"
                  value={formData.namaPenerima}
                  onChange={(e) => setFormData({ ...formData, namaPenerima: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    NISN (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="007xxxxxxx"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kelas
                  </label>
                  <input
                    type="text"
                    placeholder="XI MIPA 1"
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Peran / Predikat
                  </label>
                  <select
                    value={formData.peranSebagai}
                    onChange={(e) => setFormData({ ...formData, peranSebagai: e.target.value as any })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Juara 1">Juara 1</option>
                    <option value="Juara 2">Juara 2</option>
                    <option value="Juara 3">Juara 3</option>
                    <option value="Peserta Berprestasi">Peserta Berprestasi</option>
                    <option value="Panitia Pelaksana">Panitia Pelaksana</option>
                    <option value="Pengurus Berdedikasi">Pengurus Berdedikasi</option>
                    <option value="Narasumber">Narasumber</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tanggal Terbit
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalTerbit}
                    onChange={(e) => setFormData({ ...formData, tanggalTerbit: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Kegiatan / Event
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PORSENI & Milad Ke-15 Madrasah Al-Achdan"
                  value={formData.namaKegiatan}
                  onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Uraian Prestasi / Dedikasi
                </label>
                <textarea
                  rows={2}
                  value={formData.deskripsiPrestasi}
                  onChange={(e) => setFormData({ ...formData, deskripsiPrestasi: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-md"
                >
                  Simpan & Terbitkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
