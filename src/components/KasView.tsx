import React, { useState } from 'react';
import { 
  Coins, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Receipt, 
  FileText,
  X,
  Upload,
  Calendar,
  Wallet
} from 'lucide-react';
import { KasTransaksi, PengaturanMadrasah } from '../types';
import { DocumentData } from './DocumentPrintModal';
import { formatRupiah, downloadCsvFile, fileToBase64 } from '../utils/exportUtils';
import madrasahLogoDefault from '../assets/images/madrasah_logo_1791115779583.jpg';
import osisLogoDefault from '../assets/images/osis_logo_1791115792715.jpg';

interface KasViewProps {
  kasList: KasTransaksi[];
  onAddKas: (transaksi: KasTransaksi) => void;
  onPreviewPrint: (doc: DocumentData) => void;
  madrasahInfo: PengaturanMadrasah;
}

export const KasView: React.FC<KasViewProps> = ({
  kasList,
  onAddKas,
  onPreviewPrint,
  madrasahInfo
}) => {
  const logoMadrasah = madrasahInfo.logoMadrasahUrl || madrasahLogoDefault;
  const logoOsis = madrasahInfo.logoOsisUrl || osisLogoDefault;

  const [filterType, setFilterType] = useState<'All' | 'Pemasukan' | 'Pengeluaran'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<KasTransaksi>>({
    jenis: 'Pengeluaran',
    kategori: 'Operasional & Konsumsi',
    nominal: 50000,
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: '',
    pic: 'Fatimah Az-Zuhra (Bendahara OSIS)',
    buktiNotaUrl: ''
  });

  // Calculate totals
  const totalPemasukan = kasList
    .filter(k => k.jenis === 'Pemasukan')
    .reduce((sum, k) => sum + k.nominal, 0);

  const totalPengeluaran = kasList
    .filter(k => k.jenis === 'Pengeluaran')
    .reduce((sum, k) => sum + k.nominal, 0);

  const saldoKas = totalPemasukan - totalPengeluaran;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setFormData(prev => ({ ...prev, buktiNotaUrl: base64 }));
    }
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nominal || !formData.keterangan) return;

    const nextKwitansiNo = `KW/ACHDAN/${new Date().getFullYear()}/${String(kasList.length + 1).padStart(3, '0')}`;

    const newKas: KasTransaksi = {
      id: `kas-${Date.now()}`,
      nomorKwitansi: nextKwitansiNo,
      tanggal: formData.tanggal || new Date().toISOString().split('T')[0],
      jenis: formData.jenis as any || 'Pengeluaran',
      kategori: formData.kategori as any || 'Operasional & Konsumsi',
      nominal: Number(formData.nominal),
      keterangan: formData.keterangan,
      pic: formData.pic || 'Fatimah Az-Zuhra',
      buktiNotaUrl: formData.buktiNotaUrl || undefined
    };

    onAddKas(newKas);
    setIsAddModalOpen(false);

    // Reset Form
    setFormData({
      jenis: 'Pengeluaran',
      kategori: 'Operasional & Konsumsi',
      nominal: 50000,
      tanggal: new Date().toISOString().split('T')[0],
      keterangan: '',
      pic: 'Fatimah Az-Zuhra (Bendahara OSIS)',
      buktiNotaUrl: ''
    });
  };

  // Export to Excel / CSV
  const handleExportCsv = () => {
    const headers = ['Nomor Kwitansi', 'Tanggal', 'Jenis', 'Kategori', 'Nominal (Rp)', 'Keterangan', 'Penanggung Jawab'];
    const rows = kasList.map(k => [
      k.nomorKwitansi,
      k.tanggal,
      k.jenis,
      k.kategori,
      k.nominal,
      k.keterangan,
      k.pic
    ]);
    downloadCsvFile(`Buku_Kas_OSIS_${madrasahInfo.nama.replace(/\s+/g, '_')}_${new Date().getFullYear()}`, headers, rows);
  };

  // Generate Kwitansi Resmi
  const handlePrintKwitansi = (k: KasTransaksi) => {
    const kwitansiHtml = `
      <div style="font-family: Arial, sans-serif; border: 2px solid #1e3a8a; padding: 20pt; margin: 0 auto; width: 100%; box-sizing: border-box; background: #fff;">
        <table style="width: 100%; border-bottom: 2px solid #1e3a8a; padding-bottom: 10pt; margin-bottom: 15pt; border-collapse: collapse;">
          <tr>
            <td style="width: 55px; border: none; vertical-align: middle;">
              <img src="${logoMadrasah}" style="width: 50px; height: 50px; object-fit: contain;" />
            </td>
            <td style="border: none; padding-left: 10px;">
              <div style="font-size: 13pt; font-weight: bold; text-transform: uppercase; color: #1e3a8a;">KWITANSI RESMI KAS KEUANGAN OSIS</div>
              <div style="font-size: 11pt; font-weight: bold; color: #111;">${madrasahInfo.nama}</div>
              <div style="font-size: 8.5pt; color: #555;">${madrasahInfo.alamat} • Masa Bakti: ${madrasahInfo.periode}</div>
            </td>
            <td style="width: 55px; border: none; vertical-align: middle; text-align: right;">
              <img src="${logoOsis}" style="width: 50px; height: 50px; object-fit: contain;" />
            </td>
          </tr>
        </table>

        <div style="display: flex; justify-content: flex-end; margin-bottom: 12pt;">
          <div style="font-size: 10pt; font-family: monospace; font-weight: bold; color: #1e3a8a; border: 1px solid #1e3a8a; padding: 4pt 8pt; border-radius: 4px; background: #f0f7ff;">
            No: ${k.nomorKwitansi}
          </div>
        </div>

        <table style="width: 100%; margin-bottom: 20pt; border-collapse: collapse; font-size: 10.5pt;">
          <tr>
            <td style="width: 180px; padding: 8pt 6pt; border: none;"><strong>Sudah Terima Dari</strong></td>
            <td style="padding: 8pt 6pt; border-bottom: 1px dotted #1e3a8a;">: ${k.jenis === 'Pemasukan' ? k.pic : 'Bendahara Umum OSIS ' + madrasahInfo.nama}</td>
          </tr>
          <tr>
            <td style="padding: 8pt 6pt; border: none;"><strong>Uang Sejumlah</strong></td>
            <td style="padding: 8pt 6pt; border-bottom: 1px dotted #1e3a8a; font-style: italic; font-weight: bold; color: #1e3a8a;">: ${formatRupiah(k.nominal)}</td>
          </tr>
          <tr>
            <td style="padding: 8pt 6pt; border: none;"><strong>Untuk Pembayaran</strong></td>
            <td style="padding: 8pt 6pt; border-bottom: 1px dotted #1e3a8a;">: ${k.keterangan} (Kategori: ${k.kategori})</td>
          </tr>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 25pt;">
          <div style="border: 2px solid #1e3a8a; padding: 10pt 20pt; font-size: 15pt; font-weight: bold; background: #f8fafc; display: inline-block; color: #1e3a8a; border-radius: 6px;">
            ${formatRupiah(k.nominal)}
          </div>
          <div style="text-align: center; width: 220px; float: right; font-size: 9.5pt;">
            <div>Jawa Barat, ${k.tanggal}</div>
            <div style="font-size: 9.5pt; color: #555; margin-top: 2pt;">Bendahara Umum OSIS,</div>
            <div style="height: 50px;"></div>
            <div style="font-weight: bold; text-decoration: underline; color: #0f172a;">Fatimah Az-Zuhra</div>
            <div style="font-size: 8.5pt; color: #555;">NISN: 0078456102</div>
          </div>
        </div>
      </div>
    `;

    onPreviewPrint({
      title: `Kwitansi ${k.nomorKwitansi}`,
      tanggal: k.tanggal,
      perihal: `Kwitansi Pembayaran ${k.keterangan}`,
      contentHtml: kwitansiHtml
    });
  };

  // Generate Rekapitulasi Kas Lengkap
  const handlePrintRekap = () => {
    const rekapHtml = `
      <div style="font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 18pt;">
          <h3 style="margin: 0; font-size: 13pt; text-decoration: underline; text-transform: uppercase;">
            LAPORAN REKAPITULASI BUKU KAS KEUANGAN OSIS
          </h3>
          <p style="margin: 4pt 0 0 0; font-size: 10pt; color: #555;">
            Periode Laporan: Masa Bakti ${madrasahInfo.periode}
          </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15pt; font-size: 10pt;">
          <tr style="background: #f1f5f9;">
            <td style="border: 1px solid #333; padding: 6pt; font-weight: bold;">Total Saldo Masuk</td>
            <td style="border: 1px solid #333; padding: 6pt; font-weight: bold; color: #15803d; text-align: right;">${formatRupiah(totalPemasukan)}</td>
          </tr>
          <tr style="background: #f1f5f9;">
            <td style="border: 1px solid #333; padding: 6pt; font-weight: bold;">Total Saldo Keluar</td>
            <td style="border: 1px solid #333; padding: 6pt; font-weight: bold; color: #b91c1c; text-align: right;">${formatRupiah(totalPengeluaran)}</td>
          </tr>
          <tr style="background: #e2e8f0;">
            <td style="border: 1px solid #333; padding: 6pt; font-weight: bold; font-size: 11pt;">SISA SALDO KAS TERSEDIA</td>
            <td style="border: 1px solid #333; padding: 6pt; font-weight: bold; font-size: 11pt; color: #1e3a8a; text-align: right;">${formatRupiah(saldoKas)}</td>
          </tr>
        </table>

        <p><strong>Riwayat Rincian Mutasi Kas:</strong></p>
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
          <thead>
            <tr style="background: #e2e8f0;">
              <th style="border: 1px solid #333; padding: 4pt;">No</th>
              <th style="border: 1px solid #333; padding: 4pt;">Kwitansi</th>
              <th style="border: 1px solid #333; padding: 4pt;">Tanggal</th>
              <th style="border: 1px solid #333; padding: 4pt;">Uraian Transaksi</th>
              <th style="border: 1px solid #333; padding: 4pt;">Kategori</th>
              <th style="border: 1px solid #333; padding: 4pt; text-align: right;">Masuk (Rp)</th>
              <th style="border: 1px solid #333; padding: 4pt; text-align: right;">Keluar (Rp)</th>
            </tr>
          </thead>
          <tbody>
            ${kasList.map((k, idx) => `
              <tr>
                <td style="border: 1px solid #333; padding: 4pt; text-align: center;">${idx + 1}</td>
                <td style="border: 1px solid #333; padding: 4pt; font-family: monospace;">${k.nomorKwitansi}</td>
                <td style="border: 1px solid #333; padding: 4pt;">${k.tanggal}</td>
                <td style="border: 1px solid #333; padding: 4pt;">${k.keterangan}</td>
                <td style="border: 1px solid #333; padding: 4pt;">${k.kategori}</td>
                <td style="border: 1px solid #333; padding: 4pt; text-align: right; color: #15803d;">${k.jenis === 'Pemasukan' ? formatRupiah(k.nominal) : '-'}</td>
                <td style="border: 1px solid #333; padding: 4pt; text-align: right; color: #b91c1c;">${k.jenis === 'Pengeluaran' ? formatRupiah(k.nominal) : '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    onPreviewPrint({
      title: `Laporan Rekapitulasi Kas Keuangan OSIS`,
      tanggal: new Date().toISOString().split('T')[0],
      perihal: `Buku Kas Keuangan ${madrasahInfo.periode}`,
      contentHtml: rekapHtml,
      tandaTangan: {
        kiri: { jabatan: 'Bendahara Umum OSIS', nama: 'Fatimah Az-Zuhra' },
        kanan: { jabatan: 'Ketua Umum OSIS', nama: madrasahInfo.ketuaOsis }
      }
    });
  };

  const filteredKas = kasList.filter(k => {
    const matchType = filterType === 'All' ? true : k.jenis === filterType;
    const matchSearch = k.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        k.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        k.nomorKwitansi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-400" />
            BUKU KAS & ANGGARAN RESMI OSIS
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pencatatan kas masuk/keluar, arsip nota digital, penerbitan kwitansi sah, dan ekspor excel rekapitulasi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1e293b] hover:bg-[#334155] text-blue-300 border border-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Ekspor Excel/CSV</span>
          </button>

          <button
            onClick={handlePrintRekap}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1e293b] hover:bg-[#334155] text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>Cetak Rekap Kas</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Transaksi</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Saldo Kas Tersedia</span>
            <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {formatRupiah(saldoKas)}
          </div>
          <div className="text-[11px] text-blue-400 mt-2 font-mono">
            Kas Bersih Real-Time
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Total Pemasukan</span>
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {formatRupiah(totalPemasukan)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 font-mono">
            Dana Madrasah & Iuran Anggota
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Total Pengeluaran</span>
            <div className="p-2 rounded-lg bg-red-950/60 text-red-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-red-400">
            {formatRupiah(totalPengeluaran)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 font-mono">
            Operasional & Program Kerja
          </div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {(['All', 'Pemasukan', 'Pengeluaran'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  filterType === type
                    ? 'bg-blue-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {type === 'All' ? 'Semua Mutasi' : type}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari transaksi, kategori, atau kwitansi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0b1120] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0b1120] text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">No. Kwitansi</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Keterangan</th>
                <th className="p-3 text-right">Nominal</th>
                <th className="p-3 text-center">Struk</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredKas.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono text-blue-400 font-semibold">
                    {t.nomorKwitansi}
                  </td>
                  <td className="p-3 text-slate-400 font-mono">
                    {t.tanggal}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1e293b] text-slate-300 border border-slate-700">
                      {t.kategori}
                    </span>
                  </td>
                  <td className="p-3 text-white font-medium max-w-xs">
                    <div>{t.keterangan}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">PIC: {t.pic}</div>
                  </td>
                  <td className={`p-3 text-right font-mono font-bold text-sm ${
                    t.jenis === 'Pemasukan' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {t.jenis === 'Pemasukan' ? '+' : '-'}{formatRupiah(t.nominal)}
                  </td>
                  <td className="p-3 text-center">
                    {t.buktiNotaUrl ? (
                      <a 
                        href={t.buktiNotaUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-block p-1 text-blue-400 hover:text-blue-300 underline text-[11px]"
                      >
                        Lihat Nota
                      </a>
                    ) : (
                      <span className="text-slate-600 text-[10px]">-</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handlePrintKwitansi(t)}
                      className="p-1.5 bg-[#1e293b] hover:bg-[#334155] text-blue-400 hover:text-white rounded-lg transition-colors cursor-pointer border border-slate-700"
                      title="Cetak Kwitansi Sah"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Catat Transaksi Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-400" />
                Catat Transaksi Kas Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Jenis Transaksi
                  </label>
                  <select
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value as any })}
                    className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Pengeluaran">Pengeluaran (Kas Keluar)</option>
                    <option value="Pemasukan">Pemasukan (Kas Masuk)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tanggal
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
                  Kategori
                </label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="Operasional & Konsumsi">Operasional & Konsumsi</option>
                  <option value="Dana BOS / Madrasah">Dana BOS / Madrasah</option>
                  <option value="Iuran Kas Anggota">Iuran Kas Anggota</option>
                  <option value="Sponsorship & Usaha Mandiri">Sponsorship & Usaha Mandiri</option>
                  <option value="Perlengkapan & Logistik">Perlengkapan & Logistik</option>
                  <option value="Hadiah & Piagam Sertifikat">Hadiah & Piagam Sertifikat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nominal (Rupiah)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  required
                  placeholder="Contoh: 150000"
                  value={formData.nominal}
                  onChange={(e) => setFormData({ ...formData, nominal: Number(e.target.value) })}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Uraian / Keterangan Transaksi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembelian konsumsi rapat koordinasi milad"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Penanggung Jawab (PIC / Penerima)
                </label>
                <input
                  type="text"
                  placeholder="Nama penanggung jawab..."
                  value={formData.pic}
                  onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Upload Struk Foto */}
              <div className="p-3 bg-[#0b1120] rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Upload Bukti Struk / Nota (Opsional):
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="text-xs text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
                {formData.buktiNotaUrl && (
                  <img 
                    src={formData.buktiNotaUrl} 
                    alt="Preview Struk" 
                    className="w-16 h-16 object-cover rounded-lg border border-blue-500" 
                  />
                )}
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
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
