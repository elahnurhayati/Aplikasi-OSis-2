import React, { useState } from 'react';
import { 
  Mail, 
  Plus, 
  FileText, 
  Printer, 
  Download, 
  Search, 
  Filter, 
  Upload, 
  Check, 
  Clock, 
  AlertCircle,
  Eye,
  FileCheck2,
  Send,
  Inbox,
  Sparkles
} from 'lucide-react';
import { SuratItem, PengaturanMadrasah } from '../types';
import { DocumentData } from './DocumentPrintModal';
import { fileToBase64 } from '../utils/exportUtils';

interface SuratViewProps {
  suratList: SuratItem[];
  onAddSurat: (surat: SuratItem) => void;
  onUpdateSurat: (surat: SuratItem) => void;
  onPreviewPrint: (doc: DocumentData) => void;
  madrasahInfo: PengaturanMadrasah;
}

const ROMAN_MONTHS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export const SuratView: React.FC<SuratViewProps> = ({
  suratList,
  onAddSurat,
  onUpdateSurat,
  onPreviewPrint,
  madrasahInfo
}) => {
  const [filterType, setFilterType] = useState<'All' | 'Surat Keluar' | 'Surat Masuk'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Form State
  const currentMonthRoman = ROMAN_MONTHS[new Date().getMonth()];
  const currentYear = new Date().getFullYear();
  const nextSuratNumber = String(suratList.filter(s => s.jenis === 'Surat Keluar').length + 1).padStart(3, '0');

  const [formData, setFormData] = useState<Partial<SuratItem>>({
    jenis: 'Surat Keluar',
    klasifikasi: 'Undangan',
    nomorSurat: `${nextSuratNumber}/OSIS-ACHDAN/${currentMonthRoman}/${currentYear}`,
    perihal: '',
    tujuanPengirim: '',
    tanggal: new Date().toISOString().split('T')[0],
    tempat: `${madrasahInfo.nama}`,
    waktu: 'Pukul 08.00 - Selesai WIB',
    statusDisposisi: 'Disetujui',
    ringkasan: '',
    isiLengkap: '',
    penandatanganNama: `${madrasahInfo.ketuaOsis} (Ketua OSIS) & ${madrasahInfo.creator} (Sekretaris Umum)`
  });

  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileDataUrl, setUploadFileDataUrl] = useState('');

  // Handle template selection
  const handleApplyTemplate = (type: string) => {
    setSelectedTemplate(type);
    if (type === 'undangan') {
      setFormData(prev => ({
        ...prev,
        klasifikasi: 'Undangan',
        perihal: 'Undangan Rapat Koordinasi Panitia Pelaksana Program Kerja',
        tujuanPengirim: 'Seluruh Pengurus OSIS & MPK Madrasah Al-Achdan',
        ringkasan: 'Undangan rapat pemantapan teknis pelaksanaan kegiatan dan evaluasi berkala.',
        isiLengkap: `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nDengan memohon rahmat dan ridho Allah SWT, kami mengundang Saudara/i pengurus OSIS Madrasah Al-Achdan untuk menghadiri Rapat Koordinasi Pelaksanaan Kegiatan yang akan diselenggarakan dengan agenda utama:\n1. Pemaparan teknis lapangan dan pembagian tugas panitia pelaksana.\n2. Pembahasan alokasi anggaran dan perlengkapan sarana prasarana.\n3. Hal-hal lain yang dianggap penting.\n\nMengingat pentingnya agenda rapat ini, kehadiran rekan-rekan tepat waktu sangat diharapkan. Atas perhatian dan kerjasamanya kami ucapkan terima kasih.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh.`
      }));
    } else if (type === 'izin_tempat') {
      setFormData(prev => ({
        ...prev,
        klasifikasi: 'Permohonan Izin',
        perihal: 'Permohonan Izin Penggunaan Fasilitas dan Sarana Madrasah',
        tujuanPengirim: 'Kepala Urusan Sarana & Prasarana Madrasah Al-Achdan',
        ringkasan: 'Permohonan peminjaman aula utama dan sound system untuk kegiatan siswa.',
        isiLengkap: `Dengan hormat,\n\nSehubungan dengan rencana pelaksanaan kegiatan yang diinisiasi oleh OSIS Madrasah Al-Achdan, dengan ini kami mengajukan permohonan izin penggunaan fasilitas sarana prasarana madrasah berupa:\n1. Aula Utama Abu Bakar As-Siddiq\n2. Sound System Portable dan 2 Buah Mic Wireless\n3. Proyektor Epson Ruang Multimedia\n\nKami berkomitmen menjaga seluruh fasilitas dalam kondisi prima, bersih, dan mengembalikannya ke posisi semula setelah kegiatan selesai.\n\nDemikian surat permohonan ini kami sampaikan, atas izin dan bantuan Bapak/Ibu kami haturkan terima kasih.`
      }));
    } else if (type === 'mandat') {
      setFormData(prev => ({
        ...prev,
        klasifikasi: 'Mandat/Tugas',
        perihal: 'Surat Tugas / Mandat Delegasi Siswa Madrasah Al-Achdan',
        tujuanPengirim: 'Panitia Seleksi AKSIOMA & Lomba Eksternal',
        ringkasan: 'Surat penugasan siswa berprestasi mewakili madrasah dalam ajang perlombaan.',
        isiLengkap: `Yang bertanda tangan di bawah ini, Pengurus OSIS Madrasah Al-Achdan atas rekomendasi Kepala Madrasah, dengan ini memberikan tugas dan mandat penuh kepada siswa tertera di bawah untuk menjadi perwakilan resmi kontingen Madrasah Al-Achdan dalam Ajang Kompetisi Antar-Sekolah.\n\nHarap kepada pihak terkait dapat memberikan kemudahan dan fasilitas pendukung selama kegiatan berlangsung.`
      }));
    } else if (type === 'dana') {
      setFormData(prev => ({
        ...prev,
        klasifikasi: 'Sponsorship',
        perihal: 'Permohonan Bantuan Dana & Sponsorship Kegiatan Milad 15',
        tujuanPengirim: 'Pimpinan Perusahaan / Mitra Kerjasama',
        ringkasan: 'Pengajuan kemitraan sponsorship untuk publikasi dan stan bazar.',
        isiLengkap: `Dengan hormat,\n\nDalam rangka menyemarakkan Milad Ke-15 Madrasah Al-Achdan yang melibatkan seluruh peserta didik, guru, wali murid, dan alumni, kami menawarkan kesempatan berharga kepada perusahaan Bapak/Ibu untuk berpartisipasi sebagai sponsor resmi kegiatan kami.\n\nSebagai timbal balik, kami menyediakan slot promosi spanduk, banner digital, penyebutan sponsor resmi, serta stan promosi selama acara berlangsung.`
      }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setUploadFileName(file.name);
      setUploadFileDataUrl(base64);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.perihal || !formData.tujuanPengirim) return;

    const newSurat: SuratItem = {
      id: `surat-${Date.now()}`,
      nomorSurat: formData.nomorSurat || `${nextSuratNumber}/OSIS-ACHDAN/${currentMonthRoman}/${currentYear}`,
      jenis: formData.jenis as any || 'Surat Keluar',
      klasifikasi: formData.klasifikasi as any || 'Undangan',
      perihal: formData.perihal,
      tujuanPengirim: formData.tujuanPengirim,
      tanggal: formData.tanggal || new Date().toISOString().split('T')[0],
      statusDisposisi: formData.statusDisposisi as any || 'Disetujui',
      ringkasan: formData.ringkasan || formData.perihal,
      isiLengkap: formData.isiLengkap || '',
      tempat: formData.tempat,
      waktu: formData.waktu,
      penandatanganNama: formData.penandatanganNama,
      fileLampiranNama: uploadFileName || undefined,
      fileLampiranUrl: uploadFileDataUrl || undefined
    };

    onAddSurat(newSurat);
    setIsFormOpen(false);
  };

  const handlePrintSurat = (item: SuratItem) => {
    const formattedHtml = `
      <div style="font-size: 11pt; line-height: 1.6;">
        <p style="margin-bottom: 12pt;">
          ${(item.isiLengkap || item.ringkasan).replace(/\n/g, '<br/>')}
        </p>

        ${item.tempat || item.waktu ? `
          <table style="width: 100%; margin-top: 10pt; margin-bottom: 15pt; border: none !important;">
            ${item.tanggal ? `<tr><td style="width: 120px; border:none; padding: 2pt;"><strong>Hari / Tanggal</strong></td><td style="border:none; padding: 2pt;">: ${item.tanggal}</td></tr>` : ''}
            ${item.waktu ? `<tr><td style="border:none; padding: 2pt;"><strong>Waktu</strong></td><td style="border:none; padding: 2pt;">: ${item.waktu}</td></tr>` : ''}
            ${item.tempat ? `<tr><td style="border:none; padding: 2pt;"><strong>Tempat</strong></td><td style="border:none; padding: 2pt;">: ${item.tempat}</td></tr>` : ''}
          </table>
        ` : ''}

        <p style="margin-top: 15pt;">
          Demikian surat ini kami sampaikan, atas perhatian dan kerjasama Bapak/Ibu/Rekan-rekan sekalian, kami haturkan terima kasih.
        </p>
      </div>
    `;

    onPreviewPrint({
      title: item.perihal,
      nomorSurat: item.nomorSurat,
      tanggal: item.tanggal,
      perihal: item.perihal,
      tujuan: item.tujuanPengirim,
      lampiran: item.fileLampiranNama || '-',
      contentHtml: formattedHtml,
      tandaTangan: {
        kiri: { jabatan: 'Ketua Umum OSIS', nama: madrasahInfo.ketuaOsis },
        kanan: { jabatan: 'Sekretaris Umum OSIS', nama: madrasahInfo.creator }
      }
    });
  };

  const filteredSurat = suratList.filter(s => {
    const matchType = filterType === 'All' ? true : s.jenis === filterType;
    const matchSearch = s.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.tujuanPengirim.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            ADMINISTRASI PERSURATAN RESMI OSIS
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Penomoran otomatis standar madrasah, cetak langsung kop surat A4 resmi (dual logo), dan arsip digital
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isFormOpen ? 'Tutup Form' : 'Terbitkan Surat Baru'}</span>
        </button>
      </div>

      {/* Form Generator Modal/Section */}
      {isFormOpen && (
        <div className="bg-[#0f172a] border border-blue-500/40 rounded-2xl p-5 lg:p-7 shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">
                GENERATOR SURAT RESMI {madrasahInfo.nama}
              </h3>
              <p className="text-xs text-slate-400">
                Pilih template siap pakai atau buat surat dinas baru dengan penomoran otomatis
              </p>
            </div>
            <span className="text-[11px] font-mono text-blue-400 bg-[#1e293b] px-2.5 py-1 rounded border border-slate-700">
              Format: [No]/OSIS-ACHDAN/[Bln]/[Thn]
            </span>
          </div>

          {/* Template Fast Select */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Pilih Template Surat Cepat:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleApplyTemplate('undangan')}
                className={`p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                  selectedTemplate === 'undangan' 
                    ? 'bg-blue-600/30 border-blue-500 text-white font-semibold' 
                    : 'bg-[#1e293b] border-slate-700 text-slate-300 hover:bg-[#334155]'
                }`}
              >
                ✉️ Undangan Rapat
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('izin_tempat')}
                className={`p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                  selectedTemplate === 'izin_tempat' 
                    ? 'bg-blue-600/30 border-blue-500 text-white font-semibold' 
                    : 'bg-[#1e293b] border-slate-700 text-slate-300 hover:bg-[#334155]'
                }`}
              >
                🏫 Izin Sarpras & Aula
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('mandat')}
                className={`p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                  selectedTemplate === 'mandat' 
                    ? 'bg-blue-600/30 border-blue-500 text-white font-semibold' 
                    : 'bg-[#1e293b] border-slate-700 text-slate-300 hover:bg-[#334155]'
                }`}
              >
                📜 Surat Tugas / Mandat
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('dana')}
                className={`p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                  selectedTemplate === 'dana' 
                    ? 'bg-blue-600/30 border-blue-500 text-white font-semibold' 
                    : 'bg-[#1e293b] border-slate-700 text-slate-300 hover:bg-[#334155]'
                }`}
              >
                💼 Permohonan Sponsor
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Jenis Surat
                </label>
                <select
                  value={formData.jenis}
                  onChange={(e) => setFormData({ ...formData, jenis: e.target.value as any })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Surat Keluar">Surat Keluar</option>
                  <option value="Surat Masuk">Surat Masuk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nomor Surat (Otomatis)
                </label>
                <input
                  type="text"
                  value={formData.nomorSurat}
                  onChange={(e) => setFormData({ ...formData, nomorSurat: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-blue-300 font-mono focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tanggal Surat
                </label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Perihal Surat
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Undangan Rapat Pleno OSIS"
                  value={formData.perihal}
                  onChange={(e) => setFormData({ ...formData, perihal: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {formData.jenis === 'Surat Keluar' ? 'Tujuan Surat (Kepada Yth)' : 'Pengirim Surat'}
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Seluruh Pengurus OSIS Al-Achdan"
                  value={formData.tujuanPengirim}
                  onChange={(e) => setFormData({ ...formData, tujuanPengirim: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tempat Pelaksanaan
                </label>
                <input
                  type="text"
                  value={formData.tempat}
                  onChange={(e) => setFormData({ ...formData, tempat: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Waktu Pelaksanaan
                </label>
                <input
                  type="text"
                  value={formData.waktu}
                  onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Isi Lengkap Surat
              </label>
              <textarea
                rows={4}
                value={formData.isiLengkap}
                onChange={(e) => setFormData({ ...formData, isiLengkap: e.target.value })}
                placeholder="Tuliskan isi surat resmi..."
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Upload File Lampiran */}
            <div className="p-3 bg-[#1e293b] rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-300">
                  Upload Dokumen Scan / Lampiran (PDF / Gambar)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
                {uploadFileName && (
                  <span className="text-xs text-emerald-400 truncate max-w-xs">
                    ✓ {uploadFileName}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-md"
              >
                Simpan & Terbitkan Surat
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0f172a] p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 p-1 bg-[#1e293b] rounded-lg border border-slate-700 w-full sm:w-auto">
          {(['All', 'Surat Keluar', 'Surat Masuk'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterType === type
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type === 'All' ? 'Semua Surat' : type}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor, perihal, atau tujuan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e293b] border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Surat Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1e293b] border-b border-slate-800 text-slate-300 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Nomor & Tanggal</th>
                <th className="py-3 px-4">Jenis & Klasifikasi</th>
                <th className="py-3 px-4">Perihal & Ringkasan</th>
                <th className="py-3 px-4">Tujuan / Pengirim</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredSurat.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Tidak ada surat yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredSurat.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1e293b]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-white">
                        {item.nomorSurat}
                      </div>
                      <div className="text-[11px] text-blue-400 font-mono mt-0.5">
                        {item.tanggal}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        item.jenis === 'Surat Keluar' ? 'text-emerald-400' : 'text-blue-400'
                      }`}>
                        {item.jenis === 'Surat Keluar' ? <Send className="w-3 h-3" /> : <Inbox className="w-3 h-3" />}
                        {item.jenis}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        {item.klasifikasi}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-white truncate">
                        {item.perihal}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.ringkasan}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {item.tujuanPengirim}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 text-[10px] rounded font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {item.statusDisposisi}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handlePrintSurat(item)}
                          title="Cetak Kop Surat A4 / Unduh DOC"
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer font-medium flex items-center gap-1 text-[11px] shadow-sm"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Cetak A4</span>
                        </button>
                        {item.fileLampiranUrl && (
                          <a
                            href={item.fileLampiranUrl}
                            download={item.fileLampiranNama || 'lampiran.pdf'}
                            title={`Unduh Lampiran: ${item.fileLampiranNama}`}
                            className="p-1.5 bg-[#1e293b] hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer border border-slate-700"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
