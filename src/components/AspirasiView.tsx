import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  ThumbsUp, 
  Filter, 
  Search, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Send,
  X,
  Archive
} from 'lucide-react';
import { AspirasiSiswa, PengaturanMadrasah } from '../types';
import { DocumentData } from './DocumentPrintModal';

interface AspirasiViewProps {
  aspirasiList: AspirasiSiswa[];
  onAddAspirasi: (item: AspirasiSiswa) => void;
  onUpdateAspirasi: (item: AspirasiSiswa) => void;
  onPreviewPrint: (doc: DocumentData) => void;
  madrasahInfo: PengaturanMadrasah;
}

export const AspirasiView: React.FC<AspirasiViewProps> = ({
  aspirasiList,
  onAddAspirasi,
  onUpdateAspirasi,
  onPreviewPrint,
  madrasahInfo
}) => {
  const [filterCat, setFilterCat] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAspirasi, setSelectedAspirasi] = useState<AspirasiSiswa | null>(null);
  const [tanggapanText, setTanggapanText] = useState('');

  // Form State
  const [newForm, setNewForm] = useState({
    namaPengirim: '',
    kelas: 'X-1',
    kategori: 'Fasilitas & Sarpras' as const,
    judul: '',
    isiAspirasi: ''
  });

  const handleVote = (item: AspirasiSiswa) => {
    onUpdateAspirasi({
      ...item,
      upvotes: item.upvotes + 1
    });
  };

  const handleSaveResponse = () => {
    if (!selectedAspirasi) return;
    onUpdateAspirasi({
      ...selectedAspirasi,
      tanggapanDewan: tanggapanText,
      status: 'Diproses'
    });
    setSelectedAspirasi(null);
    setTanggapanText('');
  };

  const handleStatusChange = (item: AspirasiSiswa, status: AspirasiSiswa['status']) => {
    onUpdateAspirasi({
      ...item,
      status
    });
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.judul || !newForm.isiAspirasi) return;

    const newAsp: AspirasiSiswa = {
      id: `asp-${Date.now()}`,
      namaPengirim: newForm.namaPengirim.trim() || 'Siswa Madrasah (Anonim)',
      kelas: newForm.kelas,
      tanggal: new Date().toISOString().split('T')[0],
      kategori: newForm.kategori,
      judul: newForm.judul,
      isiAspirasi: newForm.isiAspirasi,
      status: 'Menunggu Dewan',
      upvotes: 1
    };

    onAddAspirasi(newAsp);
    setIsAddModalOpen(false);
    setNewForm({
      namaPengirim: '',
      kelas: 'X-1',
      kategori: 'Fasilitas & Sarpras',
      judul: '',
      isiAspirasi: ''
    });
  };

  const handlePrintRekapAspirasi = () => {
    const html = `
      <div style="font-size: 11pt; line-height: 1.5; font-family: Arial, sans-serif;">
        <h3 style="text-align: center; font-size: 13pt; font-weight: bold; text-transform: uppercase;">
          REKAPITULASI KOTAK ASPIRASI & SUARA SISWA MADRASAH
        </h3>
        <div style="text-align: center; font-size: 10pt; color: #555; margin-bottom: 15pt;">
          Laporan Pengurus OSIS kepada Kepala Madrasah & Pembina OSIS • ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 9.5pt;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="border: 1px solid #333; padding: 4pt; width: 30px;">No</th>
              <th style="border: 1px solid #333; padding: 4pt;">Judul & Uraian Aspirasi</th>
              <th style="border: 1px solid #333; padding: 4pt; width: 110px;">Kategori</th>
              <th style="border: 1px solid #333; padding: 4pt; width: 100px;">Pengusul</th>
              <th style="border: 1px solid #333; padding: 4pt; width: 85px;">Status</th>
              <th style="border: 1px solid #333; padding: 4pt;">Tindak Lanjut OSIS</th>
            </tr>
          </thead>
          <tbody>
            ${aspirasiList.map((a, idx) => `
              <tr>
                <td style="border: 1px solid #333; padding: 4pt; text-align: center;">${idx + 1}</td>
                <td style="border: 1px solid #333; padding: 4pt;">
                  <strong>${a.judul}</strong><br/>
                  <span style="color: #334155;">${a.isiAspirasi}</span>
                </td>
                <td style="border: 1px solid #333; padding: 4pt;">${a.kategori}</td>
                <td style="border: 1px solid #333; padding: 4pt;">${a.namaPengirim} (${a.kelas})</td>
                <td style="border: 1px solid #333; padding: 4pt; text-align: center;">${a.status}</td>
                <td style="border: 1px solid #333; padding: 4pt; font-style: italic;">${a.tanggapanDewan || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    onPreviewPrint({
      title: 'Laporan Rekapitulasi Aspirasi Siswa',
      tanggal: new Date().toISOString().split('T')[0],
      perihal: 'Rekapitulasi Kotak Aspirasi Siswa',
      contentHtml: html,
      tandaTangan: {
        kiri: { jabatan: 'Koordinator Aspirasi Siswa', nama: 'Zahra Al-Fatih' },
        kanan: { jabatan: 'Ketua Umum OSIS', nama: madrasahInfo.ketuaOsis }
      }
    });
  };

  const filteredList = aspirasiList.filter(a => {
    const matchCat = filterCat === 'All' ? true : a.kategori === filterCat;
    const matchStat = filterStatus === 'All' ? true : a.status === filterStatus;
    const matchSearch = a.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        a.isiAspirasi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchStat && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-wide">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            KOTAK SUARA SISWA & ASPIRASI MADRASAH
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Penampung aspirasi, saran, kritik membangun, dan gagasan siswa untuk dikaji dan ditindaklanjuti oleh Pengurus OSIS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintRekapAspirasi}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1e293b] hover:bg-[#334155] text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>Cetak Rekap Aspirasi</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Sampaikan Aspirasi</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0f172a] p-4 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['All', 'Fasilitas & Sarpras', 'Kegiatan OSIS', 'KBM & Akademik', 'Kantin & Lingkungan'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filterCat === cat
                  ? 'bg-blue-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'All' ? 'Semua Topik' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari aspirasi siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b1120] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Aspirasi Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((item) => (
          <div 
            key={item.id}
            className="bg-[#0f172a] border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e293b] text-blue-300 border border-slate-700 font-semibold">
                  {item.kategori}
                </span>

                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  item.status === 'Direalisasikan' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' :
                  item.status === 'Diproses' ? 'bg-blue-950 text-blue-300 border border-blue-700/50' :
                  'bg-amber-950/80 text-amber-300 border border-amber-700/50'
                }`}>
                  {item.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">
                {item.judul}
              </h3>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
                {item.isiAspirasi}
              </p>

              {/* Tanggapan Dewan Box */}
              {item.tanggapanDewan && (
                <div className="mt-3 p-3 rounded-xl bg-[#0b1120] border border-blue-900/50 text-xs">
                  <div className="text-[10px] font-mono text-blue-400 uppercase font-bold flex items-center gap-1">
                    <span>💬 Tanggapan Pengurus OSIS:</span>
                  </div>
                  <p className="text-slate-200 mt-1 italic">
                    "{item.tanggapanDewan}"
                  </p>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="text-[11px] text-slate-400">
                Pengusul: <span className="text-white font-medium">{item.namaPengirim} ({item.kelas})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVote(item)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-blue-400 border border-slate-700 text-xs cursor-pointer transition-colors"
                  title="Dukung aspirasi ini"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="font-mono font-bold">{item.upvotes}</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedAspirasi(item);
                    setTanggapanText(item.tanggapanDewan || '');
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Tanggapi
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Modal Berikan Tanggapan Dewan */}
      {selectedAspirasi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                Tanggapan Pengurus OSIS
              </h3>
              <button onClick={() => setSelectedAspirasi(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="text-xs font-bold text-blue-400">{selectedAspirasi.judul}</div>
              <p className="text-xs text-slate-300 mt-1">{selectedAspirasi.isiAspirasi}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tulis Tanggapan Resmi OSIS:
              </label>
              <textarea
                rows={3}
                value={tanggapanText}
                onChange={(e) => setTanggapanText(e.target.value)}
                placeholder="Tuliskan respon, solusi, atau jadwal tindak lanjut..."
                className="w-full bg-[#0b1120] border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedAspirasi, 'Direalisasikan')}
                  className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900 cursor-pointer"
                >
                  ✓ Realisasikan
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAspirasi(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveResponse}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow cursor-pointer"
                >
                  Kirim Tanggapan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sampaikan Aspirasi Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                Sampaikan Suara & Aspirasi Siswa
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNew} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nama Pengusul (Boleh Anonim)
                  </label>
                  <input
                    type="text"
                    placeholder="Kosongkan jika ingin anonim"
                    value={newForm.namaPengirim}
                    onChange={(e) => setNewForm({ ...newForm, namaPengirim: e.target.value })}
                    className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kelas
                  </label>
                  <input
                    type="text"
                    value={newForm.kelas}
                    onChange={(e) => setNewForm({ ...newForm, kelas: e.target.value })}
                    className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Kategori
                </label>
                <select
                  value={newForm.kategori}
                  onChange={(e) => setNewForm({ ...newForm, kategori: e.target.value as any })}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Fasilitas & Sarpras">Fasilitas & Sarana Prasarana</option>
                  <option value="Kegiatan OSIS">Kegiatan OSIS & Event</option>
                  <option value="KBM & Akademik">KBM & Suasana Akademik</option>
                  <option value="Kantin & Lingkungan">Kantin & Kebersihan Lingkungan</option>
                  <option value="Aspirasi Terbuka">Aspirasi Terbuka Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Judul Aspirasi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengadaan Tempat Sampah Organik di Lapangan"
                  value={newForm.judul}
                  onChange={(e) => setNewForm({ ...newForm, judul: e.target.value })}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Isi Saran / Aspirasi Detail
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan kebutuhan, alasan, dan saran solusi yang Anda harapkan..."
                  value={newForm.isiAspirasi}
                  onChange={(e) => setNewForm({ ...newForm, isiAspirasi: e.target.value })}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow cursor-pointer"
                >
                  Kirim Aspirasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
