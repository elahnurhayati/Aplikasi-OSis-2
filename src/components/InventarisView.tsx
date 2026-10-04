import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  QrCode, 
  ArrowRightLeft, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  X,
  ShieldCheck,
  School,
  FileCheck2,
  Boxes
} from 'lucide-react';
import { InventarisItem, PengaturanMadrasah, RiwayatPinjam } from '../types';
import { fileToBase64 } from '../utils/exportUtils';
import madrasahLogoDefault from '../assets/images/madrasah_logo_1791115779583.jpg';
import osisLogoDefault from '../assets/images/osis_logo_1791115792715.jpg';

interface InventarisViewProps {
  inventarisList: InventarisItem[];
  onAddInventaris: (item: InventarisItem) => void;
  onUpdateInventaris: (item: InventarisItem) => void;
  madrasahInfo: PengaturanMadrasah;
  onPreviewPrint: (doc: any) => void;
}

export const InventarisView: React.FC<InventarisViewProps> = ({
  inventarisList,
  onAddInventaris,
  onUpdateInventaris,
  madrasahInfo,
  onPreviewPrint
}) => {
  const logoMadrasah = madrasahInfo.logoMadrasahUrl || madrasahLogoDefault;
  const logoOsis = madrasahInfo.logoOsisUrl || osisLogoDefault;

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPinjamModalOpen, setIsPinjamModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventarisItem | null>(null);

  // Form State for Peminjaman
  const [pinjamForm, setPinjamForm] = useState({
    namaPeminjam: '',
    instansiKelas: '',
    kontak: '',
    jumlah: 1,
    tenggatKembali: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    keperluan: '',
    petugasOsis: 'Seksi Bidang Sarana & Prasarana OSIS'
  });

  // Form State for New Item
  const [newItemForm, setNewItemForm] = useState({
    kodeBarang: `INV-OSIS-${inventarisList.length + 1}`,
    namaBarang: '',
    kategori: 'Elektronik & Sound' as InventarisItem['kategori'],
    jumlahTotal: 1,
    kondisi: 'Baik' as InventarisItem['kondisi'],
    lokasiPenyimpanan: 'Ruang Sekretariat OSIS (Lemari Sarpras)',
    keterangan: '',
    fotoUrl: ''
  });

  const handleOpenPinjamModal = (item: InventarisItem) => {
    setSelectedItem(item);
    setPinjamForm(prev => ({
      ...prev,
      jumlah: 1,
      keperluan: '',
      namaPeminjam: ''
    }));
    setIsPinjamModalOpen(true);
  };

  const handleSavePinjam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (pinjamForm.jumlah > selectedItem.jumlahTersedia) {
      alert(`Stok tersedia hanya ${selectedItem.jumlahTersedia} unit!`);
      return;
    }

    const newLoan: RiwayatPinjam = {
      id: `loan-${Date.now()}`,
      namaPeminjam: pinjamForm.namaPeminjam,
      instansiKelas: pinjamForm.instansiKelas,
      kontak: pinjamForm.kontak,
      jumlah: Number(pinjamForm.jumlah),
      tanggalPinjam: new Date().toISOString().split('T')[0],
      tenggatKembali: pinjamForm.tenggatKembali,
      status: 'Sedang Dipinjam',
      keperluan: pinjamForm.keperluan,
      petugasOsis: pinjamForm.petugasOsis
    };

    const updatedItem: InventarisItem = {
      ...selectedItem,
      jumlahTersedia: selectedItem.jumlahTersedia - Number(pinjamForm.jumlah),
      riwayatPinjam: [newLoan, ...selectedItem.riwayatPinjam]
    };

    onUpdateInventaris(updatedItem);
    setIsPinjamModalOpen(false);

    // Auto prompt Berita Acara Print
    handlePrintBeritaAcara(updatedItem, newLoan);
  };

  const handleReturnItem = (item: InventarisItem, loanId: string) => {
    const loan = item.riwayatPinjam.find(l => l.id === loanId);
    if (!loan) return;

    const updatedLoans = item.riwayatPinjam.map(l => 
      l.id === loanId ? { 
        ...l, 
        status: 'Dikembalikan' as const, 
        tanggalKembaliReal: new Date().toISOString().split('T')[0] 
      } : l
    );

    const updatedItem: InventarisItem = {
      ...item,
      jumlahTersedia: Math.min(item.jumlahTotal, item.jumlahTersedia + loan.jumlah),
      riwayatPinjam: updatedLoans
    };

    onUpdateInventaris(updatedItem);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setNewItemForm(prev => ({ ...prev, fotoUrl: base64 }));
    }
  };

  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemForm.namaBarang) return;

    const newItem: InventarisItem = {
      id: `inv-${Date.now()}`,
      kodeBarang: newItemForm.kodeBarang,
      namaBarang: newItemForm.namaBarang,
      kategori: newItemForm.kategori,
      jumlahTotal: Number(newItemForm.jumlahTotal),
      jumlahTersedia: Number(newItemForm.jumlahTotal),
      kondisi: newItemForm.kondisi,
      lokasiPenyimpanan: newItemForm.lokasiPenyimpanan,
      fotoUrl: newItemForm.fotoUrl || 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80',
      keterangan: newItemForm.keterangan || 'Barang inventaris OSIS terverifikasi.',
      riwayatPinjam: []
    };

    onAddInventaris(newItem);
    setIsAddModalOpen(false);
    setNewItemForm({
      kodeBarang: `INV-OSIS-0${inventarisList.length + 2}`,
      namaBarang: '',
      kategori: 'Elektronik & Sound',
      jumlahTotal: 1,
      kondisi: 'Baik',
      lokasiPenyimpanan: 'Ruang Sekretariat OSIS (Lemari Sarpras)',
      keterangan: '',
      fotoUrl: ''
    });
  };

  // Generate Berita Acara Peminjaman
  const handlePrintBeritaAcara = (item: InventarisItem, loan: RiwayatPinjam) => {
    const beritaAcaraHtml = `
      <div>
        <div style="text-align: center; margin-bottom: 16pt;">
          <h3 style="margin: 0; font-size: 13pt; text-decoration: underline; text-transform: uppercase;">
            SURAT PERNYATAAN / BERITA ACARA PEMINJAMAN SARANA OSIS
          </h3>
          <p style="margin: 3pt 0 0 0; font-size: 10pt; font-family: monospace;">
            Nomor: BA.PINJAM/OSIS/${loan.id.replace('loan-', '')}/${new Date().getFullYear()}
          </p>
        </div>

        <p style="text-align: justify; line-height: 1.6;">
          Pada hari ini, tanggal <strong>${loan.tanggalPinjam}</strong>, telah diserahterimakan barang inventaris milik Organisasi Siswa Intra Madrasah (OSIS) <strong>${madrasahInfo.nama}</strong> untuk dipergunakan sebagaimana mestinya dengan rincian:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 12pt 0; font-size: 10pt;">
          <tr>
            <td style="width: 200px; border: 1px solid #333; padding: 6pt; background: #f8fafc; font-weight: bold;">Kode & Nama Barang</td>
            <td style="border: 1px solid #333; padding: 6pt;"><strong>${item.kodeBarang}</strong> - ${item.namaBarang}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 6pt; background: #f8fafc; font-weight: bold;">Jumlah Dipinjam</td>
            <td style="border: 1px solid #333; padding: 6pt; font-weight: bold;">${loan.jumlah} Unit</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 6pt; background: #f8fafc; font-weight: bold;">Peminjam / Unit Pengguna</td>
            <td style="border: 1px solid #333; padding: 6pt;">${loan.namaPeminjam} (${loan.instansiKelas})</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 6pt; background: #f8fafc; font-weight: bold;">Kontak Telepon/WA</td>
            <td style="border: 1px solid #333; padding: 6pt;">${loan.kontak}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 6pt; background: #f8fafc; font-weight: bold;">Keperluan Pemakaian</td>
            <td style="border: 1px solid #333; padding: 6pt;">${loan.keperluan}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 6pt; background: #f8fafc; font-weight: bold;">Batas Waktu Pengembalian</td>
            <td style="border: 1px solid #333; padding: 6pt; font-weight: bold; color: #b91c1c;">${loan.tenggatKembali}</td>
          </tr>
        </table>

        <p style="font-size: 9.5pt; font-style: italic; color: #334155; line-height: 1.5; margin-top: 15pt;">
          <strong>Ketentuan & Kewajiban Peminjam:</strong><br/>
          1. Peminjam bertanggung jawab penuh atas keutuhan, kebersihan, dan keselamatan sarana yang dipinjam.<br/>
          2. Kerusakan atau kehilangan wajib diganti atau diperbaiki sesuai dengan fungsi dan spesifikasi awal barang.<br/>
          3. Pengembalian barang wajib melapor kembali kepada Petugas Sekbid Sarana & Prasarana OSIS tepat waktu.
        </p>
      </div>
    `;

    onPreviewPrint({
      title: `Berita Acara Peminjaman ${item.namaBarang}`,
      tanggal: loan.tanggalPinjam,
      perihal: `Peminjaman Inventaris ${item.kodeBarang}`,
      contentHtml: beritaAcaraHtml,
      tandaTangan: {
        kiri: { jabatan: 'Pihak Peminjam', nama: loan.namaPeminjam },
        kanan: { jabatan: 'Petugas Sarpras OSIS', nama: loan.petugasOsis }
      }
    });
  };

  // Generate Label Barcode / Cetak Label Stiker
  const handlePrintLabel = (item: InventarisItem) => {
    const labelHtml = `
      <div style="text-align: center; border: 2px dashed #1e3a8a; padding: 15pt; width: 340px; margin: 0 auto; font-family: Arial, sans-serif; background: #fff;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 6pt;">
          <img src="${logoMadrasah}" style="width: 30px; height: 30px; object-fit: contain;" />
          <div style="font-size: 8.5pt; font-weight: bold; text-transform: uppercase; color: #1e3a8a;">
            ${madrasahInfo.nama}
          </div>
          <img src="${logoOsis}" style="width: 30px; height: 30px; object-fit: contain;" />
        </div>
        
        <div style="font-size: 8pt; color: #555; margin-bottom: 6pt; font-weight: 600;">
          LABEL INVENTARIS RESMI OSIS ${madrasahInfo.periode}
        </div>
        
        <div style="border: 1.5px solid #1e3a8a; padding: 8pt; background: #f8fafc; margin-bottom: 8pt; border-radius: 6px;">
          <div style="font-size: 13pt; font-family: monospace; font-weight: bold; letter-spacing: 2px; color: #0f172a;">
            ${item.kodeBarang}
          </div>
          <div style="font-size: 7.5pt; color: #0284c7; margin-top: 2pt; font-family: monospace;">
            *OSIS-BARCODE-SECURE*
          </div>
        </div>

        <div style="font-size: 10pt; font-weight: bold; color: #0f172a;">${item.namaBarang}</div>
        <div style="font-size: 8pt; color: #64748b; margin-top: 2pt;">Kategori: ${item.kategori}</div>
        <div style="font-size: 8pt; color: #64748b;">Lokasi: ${item.lokasiPenyimpanan}</div>
      </div>
    `;

    onPreviewPrint({
      title: `Label Stiker ${item.kodeBarang}`,
      tanggal: new Date().toISOString().split('T')[0],
      perihal: `Stiker Label Inventaris`,
      contentHtml: labelHtml
    });
  };

  // Filter items
  const filteredItems = inventarisList.filter(item => {
    const matchCat = categoryFilter === 'All' ? true : item.kategori === categoryFilter;
    const matchSearch = item.namaBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.kodeBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.lokasiPenyimpanan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            MANAJEMEN INVENTARIS & LOGISTIK SARPRAS OSIS
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Katalog perlengkapan, pencatatan sirkulasi peminjaman, surat berita acara resmi, dan cetak stiker barcode
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Barang Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0f172a] p-4 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['All', 'Elektronik & Sound', 'Peralatan Acara', 'Dokumentasi & Media'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'All' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau kode barang..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b1120] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Inventaris Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            className="bg-[#0f172a] border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between transition-all group"
          >
            <div>
              {/* Image & Badge overlay */}
              <div className="relative h-40 w-full overflow-hidden bg-[#0b1120]">
                <img 
                  src={item.fotoUrl} 
                  alt={item.namaBarang} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0b1120]/90 text-blue-300 border border-blue-500/40 backdrop-blur-md">
                  {item.kodeBarang}
                </div>
                <div className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md ${
                  item.kondisi === 'Baik' 
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50' 
                    : item.kondisi === 'Perlu Servis'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-600/50'
                      : 'bg-red-950/80 text-red-300 border border-red-600/50'
                }`}>
                  {item.kondisi}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                    {item.kategori}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5 line-clamp-1">
                    {item.namaBarang}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span>📍</span>
                    <span>{item.lokasiPenyimpanan}</span>
                  </div>
                </div>

                {/* Stock Counter */}
                <div className="p-2.5 rounded-xl bg-[#0b1120] border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Tersedia</span>
                    <div className="font-bold text-base font-mono text-emerald-400">
                      {item.jumlahTersedia} <span className="text-xs font-normal text-slate-400">Unit</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Total Unit</span>
                    <div className="font-bold text-base font-mono text-white">
                      {item.jumlahTotal} <span className="text-xs font-normal text-slate-400">Unit</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {item.keterangan}
                </p>

                {/* Active Loans */}
                {item.riwayatPinjam.filter(l => l.status === 'Sedang Dipinjam').length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Peminjaman Aktif:
                    </div>
                    {item.riwayatPinjam
                      .filter(l => l.status === 'Sedang Dipinjam')
                      .map((loan) => (
                        <div 
                          key={loan.id}
                          className="p-2 rounded-lg bg-amber-950/20 border border-amber-800/40 text-[11px] flex items-center justify-between"
                        >
                          <div>
                            <div className="font-semibold text-amber-200">
                              {loan.namaPeminjam} ({loan.jumlah} Unit)
                            </div>
                            <div className="text-[10px] text-amber-400/80">
                              Tenggat: {loan.tenggatKembali}
                            </div>
                          </div>
                          <button
                            onClick={() => handleReturnItem(item, loan.id)}
                            className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[10px] rounded cursor-pointer transition-colors"
                          >
                            Kembalikan
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 pt-0 flex items-center justify-between gap-2">
              <button
                onClick={() => handlePrintLabel(item)}
                title="Cetak Label Stiker QR"
                className="p-2 bg-[#1e293b] hover:bg-[#334155] text-slate-200 border border-slate-700 rounded-lg text-xs transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-blue-400" />
              </button>

              <button
                onClick={() => handleOpenPinjamModal(item)}
                disabled={item.jumlahTersedia <= 0}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  item.jumlahTersedia > 0
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>{item.jumlahTersedia > 0 ? 'Pinjam Barang' : 'Stok Habis'}</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Modal Peminjaman Baru */}
      {isPinjamModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  FORM PEMINJAMAN SARANA LOGISTIK
                </h3>
                <p className="text-xs text-blue-400">
                  {selectedItem.namaBarang} (Tersedia: {selectedItem.jumlahTersedia} Unit)
                </p>
              </div>
              <button
                onClick={() => setIsPinjamModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePinjam} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Peminjam / Ekskul / Guru
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Panitia Porseni / Ahmad Fauzi"
                  value={pinjamForm.namaPeminjam}
                  onChange={(e) => setPinjamForm({ ...pinjamForm, namaPeminjam: e.target.value })}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kelas / Instansi
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kelas XI MIPA 1"
                    value={pinjamForm.instansiKelas}
                    onChange={(e) => setPinjamForm({ ...pinjamForm, instansiKelas: e.target.value })}
                    className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    No. WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={pinjamForm.kontak}
                    onChange={(e) => setPinjamForm({ ...pinjamForm, kontak: e.target.value })}
                    className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Jumlah Unit
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedItem.jumlahTersedia}
                    required
                    value={pinjamForm.jumlah}
                    onChange={(e) => setPinjamForm({ ...pinjamForm, jumlah: Number(e.target.value) })}
                    className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Batas Waktu Kembali
                  </label>
                  <input
                    type="date"
                    required
                    value={pinjamForm.tenggatKembali}
                    onChange={(e) => setPinjamForm({ ...pinjamForm, tenggatKembali: e.target.value })}
                    className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Keperluan Pemakaian
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Gladi resik perhelatan milad madrasah"
                  value={pinjamForm.keperluan}
                  onChange={(e) => setPinjamForm({ ...pinjamForm, keperluan: e.target.value })}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPinjamModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg cursor-pointer hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg cursor-pointer shadow"
                >
                  Catat & Terbitkan Berita Acara
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Barang Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  TAMBAH INVENTARIS BARU
                </h3>
                <p className="text-xs text-slate-400">
                  Registrasi aset ke dalam basis data Sarana & Prasarana OSIS {madrasahInfo.nama}
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewItem} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kode Barang
                  </label>
                  <input
                    type="text"
                    required
                    value={newItemForm.kodeBarang}
                    onChange={(e) => setNewItemForm({ ...newItemForm, kodeBarang: e.target.value })}
                    className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={newItemForm.kategori}
                    onChange={(e) => setNewItemForm({ ...newItemForm, kategori: e.target.value as any })}
                    className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Elektronik & Sound">Elektronik & Sound</option>
                    <option value="Peralatan Acara">Peralatan Acara</option>
                    <option value="Dokumentasi & Media">Dokumentasi & Media</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Barang
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kabel Roll 50 Meter Uticon"
                  value={newItemForm.namaBarang}
                  onChange={(e) => setNewItemForm({ ...newItemForm, namaBarang: e.target.value })}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Jumlah Total (Unit)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newItemForm.jumlahTotal}
                    onChange={(e) => setNewItemForm({ ...newItemForm, jumlahTotal: Number(e.target.value) })}
                    className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kondisi Barang
                  </label>
                  <select
                    value={newItemForm.kondisi}
                    onChange={(e) => setNewItemForm({ ...newItemForm, kondisi: e.target.value as any })}
                    className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Perlu Servis">Perlu Servis</option>
                    <option value="Rusak">Rusak</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Lokasi Penyimpanan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ruang OSIS Lemari Sarpras B2"
                  value={newItemForm.lokasiPenyimpanan}
                  onChange={(e) => setNewItemForm({ ...newItemForm, lokasiPenyimpanan: e.target.value })}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Upload Foto Barang */}
              <div className="p-3 bg-[#0b1120] rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Upload Foto Barang:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="text-xs text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
                {newItemForm.fotoUrl && (
                  <img 
                    src={newItemForm.fotoUrl} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded-lg border border-blue-500" 
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Keterangan Tambahan
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan kelengkapan aksesoris, charger, dus..."
                  value={newItemForm.keterangan}
                  onChange={(e) => setNewItemForm({ ...newItemForm, keterangan: e.target.value })}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
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
                  Simpan Barang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
