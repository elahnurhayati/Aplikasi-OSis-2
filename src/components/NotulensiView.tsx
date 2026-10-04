import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  CheckCircle, 
  Printer, 
  Download, 
  Search, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';
import { NotulensiRapat, Pengurus, PresensiItem, PengaturanMadrasah } from '../types';
import { DocumentData } from './DocumentPrintModal';

interface NotulensiViewProps {
  notulensiList: NotulensiRapat[];
  pengurusList: Pengurus[];
  onAddNotulensi: (notulensi: NotulensiRapat) => void;
  onPreviewPrint: (doc: DocumentData) => void;
  madrasahInfo: PengaturanMadrasah;
}

export const NotulensiView: React.FC<NotulensiViewProps> = ({
  notulensiList,
  pengurusList,
  onAddNotulensi,
  onPreviewPrint,
  madrasahInfo
}) => {
  const [selectedNotulensi, setSelectedNotulensi] = useState<NotulensiRapat>(notulensiList[0] || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    nomorNotulen: `NOT/OSIS-ACHDAN/${new Date().getMonth() + 1}/${String(notulensiList.length + 1).padStart(2, '0')}`,
    judulRapat: '',
    tanggal: new Date().toISOString().split('T')[0],
    waktu: '13.00 - 15.00 WIB',
    tempat: `Ruang Sekretariat OSIS ${madrasahInfo.nama}`,
    pemimpinRapat: madrasahInfo.ketuaOsis,
    notulis: madrasahInfo.creator,
    agenda: '',
    pembahasan: '',
    hasilKeputusanText: '',
    tindakLanjut: ''
  });

  const [attendanceState, setAttendanceState] = useState<PresensiItem[]>(
    pengurusList.map(p => ({
      id: `pres-${p.id}`,
      pengurusId: p.id,
      nama: p.nama,
      jabatan: p.jabatan,
      status: 'Hadir'
    }))
  );

  const handleStatusChange = (pengurusId: string, status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa') => {
    setAttendanceState(prev => 
      prev.map(item => item.pengurusId === pengurusId ? { ...item, status } : item)
    );
  };

  const handleSaveNotulensi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judulRapat) return;

    const decisions = formData.hasilKeputusanText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const newNotul: NotulensiRapat = {
      id: `notul-${Date.now()}`,
      nomorNotulen: formData.nomorNotulen,
      judulRapat: formData.judulRapat,
      tanggal: formData.tanggal,
      waktu: formData.waktu,
      tempat: formData.tempat,
      pemimpinRapat: formData.pemimpinRapat,
      notulis: formData.notulis,
      agenda: formData.agenda,
      pembahasan: formData.pembahasan,
      hasilKeputusan: decisions.length > 0 ? decisions : ['Persetujuan seluruh agenda rapat pengurus OSIS.'],
      tindakLanjut: formData.tindakLanjut || 'Pelaksanaan koordinasi dan realisasi program oleh panitia pelaksana.',
      presensi: attendanceState,
      status: 'Final'
    };

    onAddNotulensi(newNotul);
    setSelectedNotulensi(newNotul);
    setIsAddModalOpen(false);

    // Reset Form
    setFormData({
      nomorNotulen: `NOT/OSIS-ACHDAN/${new Date().getMonth() + 1}/${String(notulensiList.length + 2).padStart(2, '0')}`,
      judulRapat: '',
      tanggal: new Date().toISOString().split('T')[0],
      waktu: '13.00 - 15.00 WIB',
      tempat: `Ruang Sekretariat OSIS ${madrasahInfo.nama}`,
      pemimpinRapat: madrasahInfo.ketuaOsis,
      notulis: madrasahInfo.creator,
      agenda: '',
      pembahasan: '',
      hasilKeputusanText: '',
      tindakLanjut: ''
    });
  };

  // Generate Official Notulensi Rapat & Presensi Document
  const handlePrintNotulensi = (n: NotulensiRapat) => {
    const totalHadir = n.presensi.filter(p => p.status === 'Hadir').length;
    const totalIzin = n.presensi.filter(p => p.status === 'Izin').length;
    const totalSakit = n.presensi.filter(p => p.status === 'Sakit').length;
    const totalAlpa = n.presensi.filter(p => p.status === 'Alpa').length;

    const notulHtml = `
      <div style="font-size: 11pt; line-height: 1.6; font-family: Arial, sans-serif;">
        <h3 style="text-align: center; font-size: 13pt; font-weight: bold; margin-bottom: 2pt; text-transform: uppercase;">
          BERITA ACARA & NOTULENSI RAPAT PENGURUS OSIS
        </h3>
        <div style="text-align: center; font-size: 10pt; color: #555; margin-bottom: 15pt;">
          Nomor Dokumen: ${n.nomorNotulen}
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15pt;">
          <tr>
            <td style="width: 30%; border: 1px solid #333; padding: 5pt; background: #f8fafc; font-weight: bold;">Agenda / Topik Rapat</td>
            <td style="border: 1px solid #333; padding: 5pt; font-weight: bold;">${n.judulRapat}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 5pt; background: #f8fafc; font-weight: bold;">Hari / Tanggal</td>
            <td style="border: 1px solid #333; padding: 5pt;">${new Date(n.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 5pt; background: #f8fafc; font-weight: bold;">Waktu Pelaksanaan</td>
            <td style="border: 1px solid #333; padding: 5pt;">${n.waktu}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 5pt; background: #f8fafc; font-weight: bold;">Tempat / Lokasi</td>
            <td style="border: 1px solid #333; padding: 5pt;">${n.tempat}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 5pt; background: #f8fafc; font-weight: bold;">Pemimpin Rapat</td>
            <td style="border: 1px solid #333; padding: 5pt;">${n.pemimpinRapat}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 5pt; background: #f8fafc; font-weight: bold;">Notulis / Pencatat</td>
            <td style="border: 1px solid #333; padding: 5pt;">${n.notulis}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 5pt; background: #f8fafc; font-weight: bold;">Rekap Kehadiran</td>
            <td style="border: 1px solid #333; padding: 5pt;">
              Hadir: ${totalHadir} | Izin: ${totalIzin} | Sakit: ${totalSakit} | Alpa: ${totalAlpa} (Total: ${n.presensi.length} Pengurus)
            </td>
          </tr>
        </table>

        <p><strong>I. AGENDA PEMBAHASAN</strong></p>
        <p style="text-align: justify; margin-left: 15pt;">
          ${n.agenda.replace(/\n/g, '<br/>')}
        </p>

        <p><strong>II. DINAMIKA & CATATAN DISKUSI</strong></p>
        <p style="text-align: justify; margin-left: 15pt;">
          ${n.pembahasan.replace(/\n/g, '<br/>')}
        </p>

        <p><strong>III. HASIL KESEPAKATAN & KEPUTUSAN RAPAT</strong></p>
        <ol style="margin-left: 15pt;">
          ${n.hasilKeputusan.map(k => `<li>${k}</li>`).join('')}
        </ol>

        <p><strong>IV. RENCANA TINDAK LANJUT</strong></p>
        <p style="text-align: justify; margin-left: 15pt;">
          ${n.tindakLanjut}
        </p>

        <p style="margin-top: 20pt;"><strong>DAFTAR HADIR PENGURUS:</strong></p>
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt; margin-top: 6pt;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="border: 1px solid #333; padding: 4pt; width: 30px;">No</th>
              <th style="border: 1px solid #333; padding: 4pt;">Nama Pengurus</th>
              <th style="border: 1px solid #333; padding: 4pt;">Jabatan</th>
              <th style="border: 1px solid #333; padding: 4pt; text-align: center; width: 70px;">Status</th>
              <th style="border: 1px solid #333; padding: 4pt; text-align: center; width: 100px;">Paraf</th>
            </tr>
          </thead>
          <tbody>
            ${n.presensi.map((p, idx) => `
              <tr>
                <td style="border: 1px solid #333; padding: 4pt; text-align: center;">${idx + 1}</td>
                <td style="border: 1px solid #333; padding: 4pt; font-weight: bold;">${p.nama}</td>
                <td style="border: 1px solid #333; padding: 4pt;">${p.jabatan}</td>
                <td style="border: 1px solid #333; padding: 4pt; text-align: center;">${p.status}</td>
                <td style="border: 1px solid #333; padding: 4pt; text-align: center; font-family: monospace; font-size: 8pt;">${p.status === 'Hadir' ? '[ PARAF ]' : '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    onPreviewPrint({
      title: `Notulensi ${n.judulRapat}`,
      tanggal: n.tanggal,
      perihal: `Notulensi Rapat ${n.nomorNotulen}`,
      contentHtml: notulHtml,
      tandaTangan: {
        kiri: { jabatan: 'Pemimpin Rapat (Ketua OSIS)', nama: n.pemimpinRapat },
        kanan: { jabatan: 'Sekretaris Umum OSIS', nama: n.notulis }
      }
    });
  };

  const filteredNotul = notulensiList.filter(n =>
    n.judulRapat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.nomorNotulen.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            PRESENSI DIGITAL & NOTULENSI RAPAT OSIS
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pencatatan absensi rapat pengurus, notulensi hasil keputusan, dan cetak berita acara resmi bertandatangan
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Notulensi Rapat Baru</span>
        </button>
      </div>

      {/* Grid: Master Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: List of Meetings */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari risalah rapat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredNotul.map((item) => {
              const isSelected = selectedNotulensi?.id === item.id;
              const hadirCount = item.presensi.filter(p => p.status === 'Hadir').length;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedNotulensi(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500/80 shadow-md'
                      : 'bg-[#0f172a] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-mono text-blue-400">{item.nomorNotulen}</span>
                    <span>{item.tanggal}</span>
                  </div>

                  <h3 className="text-xs font-bold text-white mb-2 line-clamp-2">
                    {item.judulRapat}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      {hadirCount} Hadir
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#1e293b] text-blue-300">
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Meeting Detail Preview */}
        <div className="lg:col-span-8">
          {selectedNotulensi ? (
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-blue-950/60 text-blue-400 border border-blue-800/60">
                      {selectedNotulensi.nomorNotulen}
                    </span>
                    <span className="text-xs text-slate-400">
                      {selectedNotulensi.tanggal} • {selectedNotulensi.waktu}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">
                    {selectedNotulensi.judulRapat}
                  </h2>
                </div>

                <button
                  onClick={() => handlePrintNotulensi(selectedNotulensi)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all self-start sm:self-auto"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Notulensi Sah</span>
                </button>
              </div>

              {/* Info Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0b1120] p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono">Tempat Pelaksanaan</span>
                  <div className="font-semibold text-white mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{selectedNotulensi.tempat}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono">Pemimpin Rapat</span>
                  <div className="font-semibold text-white mt-0.5">{selectedNotulensi.pemimpinRapat}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono">Notulis / Pencatat</span>
                  <div className="font-semibold text-white mt-0.5">{selectedNotulensi.notulis}</div>
                </div>
              </div>

              {/* Pembahasan & Agenda */}
              <div className="space-y-4 text-xs leading-relaxed">
                <div>
                  <h4 className="font-bold text-blue-400 text-xs uppercase tracking-wider mb-1.5">
                    Agenda Utama
                  </h4>
                  <p className="text-slate-300 bg-[#0b1120] p-3 rounded-xl border border-slate-800">
                    {selectedNotulensi.agenda}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-blue-400 text-xs uppercase tracking-wider mb-1.5">
                    Ringkasan Diskusi & Aspirasi
                  </h4>
                  <p className="text-slate-300 bg-[#0b1120] p-3 rounded-xl border border-slate-800 whitespace-pre-line">
                    {selectedNotulensi.pembahasan}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider mb-1.5">
                    Keputusan & Kesepakatan Final
                  </h4>
                  <ul className="space-y-1.5 bg-[#0b1120] p-3 rounded-xl border border-slate-800 text-slate-200">
                    {selectedNotulensi.hasilKeputusan.map((dec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{dec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-blue-400 text-xs uppercase tracking-wider mb-1.5">
                    Rencana Tindak Lanjut
                  </h4>
                  <p className="text-slate-300 bg-[#0b1120] p-3 rounded-xl border border-slate-800">
                    {selectedNotulensi.tindakLanjut}
                  </p>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="space-y-2 border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    Daftar Presensi Kehadiran ({selectedNotulensi.presensi.length} Pengurus)
                  </h4>
                  <div className="flex gap-2 text-[10px]">
                    <span className="text-emerald-400 font-mono">
                      Hadir: {selectedNotulensi.presensi.filter(p => p.status === 'Hadir').length}
                    </span>
                    <span className="text-blue-400 font-mono">
                      Izin: {selectedNotulensi.presensi.filter(p => p.status === 'Izin').length}
                    </span>
                    <span className="text-amber-400 font-mono">
                      Sakit: {selectedNotulensi.presensi.filter(p => p.status === 'Sakit').length}
                    </span>
                    <span className="text-red-400 font-mono">
                      Alpa: {selectedNotulensi.presensi.filter(p => p.status === 'Alpa').length}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#0b1120] text-slate-400 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-2.5">Nama</th>
                        <th className="p-2.5">Jabatan</th>
                        <th className="p-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {selectedNotulensi.presensi.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/30">
                          <td className="p-2.5 font-medium text-white">{p.nama}</td>
                          <td className="p-2.5 text-slate-400">{p.jabatan}</td>
                          <td className="p-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.status === 'Hadir' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' :
                              p.status === 'Izin' ? 'bg-blue-950 text-blue-400 border border-blue-800/50' :
                              p.status === 'Sakit' ? 'bg-amber-950 text-amber-400 border border-amber-800/50' :
                              'bg-red-950 text-red-400 border border-red-800/50'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              Pilih risalah sidang atau buat risalah baru
            </div>
          )}
        </div>

      </div>

      {/* Modal Buat Notulensi Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Buat Risalah & Notulensi Rapat Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotulensi} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nomor Dokumen Notulensi
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nomorNotulen}
                    onChange={(e) => setFormData({ ...formData, nomorNotulen: e.target.value })}
                    className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tanggal Rapat
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Judul / Topik Agenda Rapat
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rapat Koordinasi Matriks Anggaran LPJ Milad"
                  value={formData.judulRapat}
                  onChange={(e) => setFormData({ ...formData, judulRapat: e.target.value })}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Waktu / Jam
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.waktu}
                    onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                    className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tempat / Ruangan
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tempat}
                    onChange={(e) => setFormData({ ...formData, tempat: e.target.value })}
                    className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Pemimpin Rapat
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pemimpinRapat}
                    onChange={(e) => setFormData({ ...formData, pemimpinRapat: e.target.value })}
                    className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Notulis / Pencatat
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.notulis}
                    onChange={(e) => setFormData({ ...formData, notulis: e.target.value })}
                    className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Agenda Pembahasan
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Poin-poin bahasan utama rapat..."
                  value={formData.agenda}
                  onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Catatan Jalannya Pembahasan & Dinamika Diskusi
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Rangkuman argumen dan pembahasan..."
                  value={formData.pembahasan}
                  onChange={(e) => setFormData({ ...formData, pembahasan: e.target.value })}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Hasil Keputusan Final (1 baris per poin)
                </label>
                <textarea
                  rows={3}
                  placeholder="Setiap baris adalah satu butir keputusan..."
                  value={formData.hasilKeputusanText}
                  onChange={(e) => setFormData({ ...formData, hasilKeputusanText: e.target.value })}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Rencana Tindak Lanjut
                </label>
                <input
                  type="text"
                  placeholder="Langkah teknis selanjutnya..."
                  value={formData.tindakLanjut}
                  onChange={(e) => setFormData({ ...formData, tindakLanjut: e.target.value })}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Quick Attendance Check */}
              <div className="space-y-2 border-t border-slate-800 pt-3">
                <label className="block text-xs font-medium text-slate-300">
                  Presensi Kehadiran Pengurus:
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 bg-[#0b1120] p-2.5 rounded-xl border border-slate-800">
                  {attendanceState.map((att) => (
                    <div key={att.pengurusId} className="flex items-center justify-between text-xs py-1 px-2 hover:bg-slate-800/40 rounded">
                      <div>
                        <span className="font-semibold text-white">{att.nama}</span>
                        <span className="text-[11px] text-slate-400 ml-2">({att.jabatan})</span>
                      </div>
                      <div className="flex gap-1">
                        {(['Hadir', 'Izin', 'Sakit', 'Alpa'] as const).map((st) => (
                          <button
                            type="button"
                            key={st}
                            onClick={() => handleStatusChange(att.pengurusId, st)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                              att.status === st
                                ? st === 'Hadir' ? 'bg-emerald-600 text-white' :
                                  st === 'Izin' ? 'bg-blue-600 text-white' :
                                  st === 'Sakit' ? 'bg-amber-600 text-slate-950' : 'bg-red-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg cursor-pointer hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg cursor-pointer shadow"
                >
                  Simpan Notulensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
