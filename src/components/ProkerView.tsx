import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  CheckSquare, 
  Square, 
  Upload, 
  DollarSign, 
  Calendar, 
  FileText, 
  Printer, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Camera, 
  CheckCircle2, 
  X,
  Coins,
  Receipt,
  Trash2,
  Layers,
  Calculator,
  ArrowDownLeft,
  ArrowUpRight,
  PieChart,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Proker, Milestone, ItemAnggaranLPJ, PenerimaanDanaLPJ, PengaturanMadrasah } from '../types';
import { DocumentData } from './DocumentPrintModal';
import { formatRupiah, fileToBase64 } from '../utils/exportUtils';

interface ProkerViewProps {
  prokerList: Proker[];
  onUpdateProker: (proker: Proker) => void;
  onAddProker: (proker: Proker) => void;
  onPreviewPrint: (doc: DocumentData) => void;
  madrasahInfo: PengaturanMadrasah;
}

const KATEGORI_LPJ_LIST: ItemAnggaranLPJ['kategori'][] = [
  'Kesekretariatan & Cetak',
  'Konsumsi Panitia & Peserta',
  'Perlengkapan & Sound',
  'Hadiah, Piala & Piagam',
  'Transport & Akomodasi',
  'Honorarium Juri/Pemateri',
  'Dekorasi & Dokumentasi',
  'Biaya Operasional & Tak Terduga'
];

export const ProkerView: React.FC<ProkerViewProps> = ({
  prokerList,
  onUpdateProker,
  onAddProker,
  onPreviewPrint,
  madrasahInfo
}) => {
  const [selectedProker, setSelectedProker] = useState<Proker | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Budget & LPJ Setting Modal State
  const [selectedBudgetProker, setSelectedBudgetProker] = useState<Proker | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [activeBudgetTab, setActiveBudgetTab] = useState<'pengeluaran' | 'penerimaan' | 'ringkasan'>('pengeluaran');

  // New Budget Expense Item Form State
  const [newExpenseForm, setNewExpenseForm] = useState<{
    kategori: ItemAnggaranLPJ['kategori'];
    uraian: string;
    volume: number;
    satuan: string;
    hargaSatuan: number;
    realisasi: number;
    catatanNota: string;
  }>({
    kategori: 'Kesekretariatan & Cetak',
    uraian: '',
    volume: 1,
    satuan: 'Paket',
    hargaSatuan: 100000,
    realisasi: 100000,
    catatanNota: ''
  });

  // New Budget Inflow Item Form State
  const [newIncomeForm, setNewIncomeForm] = useState<{
    sumber: string;
    nominalRencana: number;
    nominalDiterima: number;
    keterangan: string;
  }>({
    sumber: '',
    nominalRencana: 500000,
    nominalDiterima: 500000,
    keterangan: ''
  });

  // Fast Field Report Form State
  const [reportProgress, setReportProgress] = useState<number>(0);
  const [reportNote, setReportNote] = useState<string>('');
  const [reportSpent, setReportSpent] = useState<number>(0);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>('');
  const [uploadedPhotoCaption, setUploadedPhotoCaption] = useState<string>('');

  // Add Proker Form State
  const [newProkerData, setNewProkerData] = useState<Partial<Proker>>({
    kode: `PROKER-OSIS-0${prokerList.length + 1}`,
    nama: '',
    sekbid: 'Badan Pengurus Harian (BPH)',
    deskripsi: '',
    status: 'Perencanaan',
    targetTanggal: new Date().toISOString().split('T')[0],
    progres: 0,
    anggaran: 2000000,
    terpakai: 0,
    picNama: madrasahInfo.ketuaOsis,
    picHp: '0812-3456-7890',
    catatanTerbaru: 'Program kerja baru diinisiasi',
    milestones: [
      { id: 'm-new-1', judul: 'Penyusunan Proposal & Perizinan Madrasah', selesai: false, targetTanggal: '' },
      { id: 'm-new-2', judul: 'Rapat Koordinasi Panitia Pelaksana', selesai: false, targetTanggal: '' },
      { id: 'm-new-3', judul: 'Pelaksanaan Hari H & Operasional Lapangan', selesai: false, targetTanggal: '' },
      { id: 'm-new-4', judul: 'Penyusunan LPJ & Rapat Evaluasi', selesai: false, targetTanggal: '' }
    ],
    fotoDokumentasi: [],
    rincianAnggaranLPJ: [],
    penerimaanDanaLPJ: []
  });

  const handleOpenUpdateModal = (p: Proker) => {
    setSelectedProker(p);
    setReportProgress(p.progres);
    setReportNote(p.catatanTerbaru);
    setReportSpent(p.terpakai);
    setUploadedPhotoUrl('');
    setUploadedPhotoCaption('');
    setIsUpdateModalOpen(true);
  };

  const handleOpenBudgetModal = (p: Proker) => {
    setSelectedBudgetProker(p);
    setActiveBudgetTab('pengeluaran');
    setIsBudgetModalOpen(true);
  };

  const handleToggleMilestone = (proker: Proker, milestoneId: string) => {
    const updatedMilestones = proker.milestones.map(m => 
      m.id === milestoneId ? { ...m, selesai: !m.selesai } : m
    );
    const completedCount = updatedMilestones.filter(m => m.selesai).length;
    const calculatedProgress = Math.round((completedCount / updatedMilestones.length) * 100);

    const updated: Proker = {
      ...proker,
      milestones: updatedMilestones,
      progres: calculatedProgress,
      status: calculatedProgress === 100 ? 'Selesai' : (calculatedProgress > 0 ? 'Sedang Berjalan' : proker.status),
      lastUpdated: new Date().toLocaleString('id-ID')
    };

    onUpdateProker(updated);
    if (selectedProker && selectedProker.id === proker.id) {
      setSelectedProker(updated);
      setReportProgress(calculatedProgress);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setUploadedPhotoUrl(base64);
    }
  };

  const handleSaveUpdate = () => {
    if (!selectedProker) return;

    let updatedPhotos = [...selectedProker.fotoDokumentasi];
    if (uploadedPhotoUrl) {
      updatedPhotos.push({
        id: `fd-${Date.now()}`,
        url: uploadedPhotoUrl,
        caption: uploadedPhotoCaption || 'Dokumentasi lapangan terbaru',
        tanggal: new Date().toISOString().split('T')[0]
      });
    }

    const updated: Proker = {
      ...selectedProker,
      progres: Number(reportProgress),
      terpakai: Number(reportSpent),
      catatanTerbaru: reportNote || selectedProker.catatanTerbaru,
      fotoDokumentasi: updatedPhotos,
      status: Number(reportProgress) === 100 ? 'Selesai' : (Number(reportProgress) > 0 ? 'Sedang Berjalan' : selectedProker.status),
      lastUpdated: new Date().toLocaleString('id-ID')
    };

    onUpdateProker(updated);
    setIsUpdateModalOpen(false);
  };

  const handleSaveNewProker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProkerData.nama) return;

    const newP: Proker = {
      id: `proker-${Date.now()}`,
      kode: newProkerData.kode || `PROK-${Date.now()}`,
      nama: newProkerData.nama,
      sekbid: newProkerData.sekbid || 'Badan Pengurus Harian (BPH)',
      deskripsi: newProkerData.deskripsi || '',
      status: newProkerData.status as any || 'Perencanaan',
      targetTanggal: newProkerData.targetTanggal || new Date().toISOString().split('T')[0],
      progres: 0,
      anggaran: Number(newProkerData.anggaran || 0),
      terpakai: 0,
      picNama: newProkerData.picNama || madrasahInfo.ketuaOsis,
      picHp: newProkerData.picHp || '',
      catatanTerbaru: 'Program kerja baru diinisiasi',
      milestones: newProkerData.milestones || [],
      fotoDokumentasi: [],
      rincianAnggaranLPJ: [],
      penerimaanDanaLPJ: [],
      lastUpdated: new Date().toLocaleString('id-ID')
    };

    onAddProker(newP);
    setIsAddModalOpen(false);
  };

  // --- LPJ Budget Setting Functions ---
  const handleAddBudgetItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBudgetProker || !newExpenseForm.uraian.trim()) return;

    const volume = Number(newExpenseForm.volume) || 1;
    const hargaSatuan = Number(newExpenseForm.hargaSatuan) || 0;
    const rencana = volume * hargaSatuan;
    const realisasi = Number(newExpenseForm.realisasi) || rencana;

    const newItem: ItemAnggaranLPJ = {
      id: `rab-${Date.now()}`,
      kategori: newExpenseForm.kategori,
      uraian: newExpenseForm.uraian.trim(),
      volume,
      satuan: newExpenseForm.satuan.trim() || 'Paket',
      hargaSatuan,
      rencana,
      realisasi,
      catatanNota: newExpenseForm.catatanNota.trim() || undefined
    };

    const currentItems = selectedBudgetProker.rincianAnggaranLPJ || [];
    const updatedItems = [...currentItems, newItem];

    // Calculate auto updated totals
    const totalRencana = updatedItems.reduce((acc, curr) => acc + curr.rencana, 0);
    const totalRealisasi = updatedItems.reduce((acc, curr) => acc + curr.realisasi, 0);

    const updatedProker: Proker = {
      ...selectedBudgetProker,
      rincianAnggaranLPJ: updatedItems,
      anggaran: totalRencana > 0 ? totalRencana : selectedBudgetProker.anggaran,
      terpakai: totalRealisasi,
      lastUpdated: new Date().toLocaleString('id-ID')
    };

    setSelectedBudgetProker(updatedProker);
    onUpdateProker(updatedProker);

    // Reset Form
    setNewExpenseForm({
      kategori: newExpenseForm.kategori,
      uraian: '',
      volume: 1,
      satuan: 'Paket',
      hargaSatuan: 100000,
      realisasi: 100000,
      catatanNota: ''
    });
  };

  const handleDeleteBudgetItem = (itemId: string) => {
    if (!selectedBudgetProker) return;
    const updatedItems = (selectedBudgetProker.rincianAnggaranLPJ || []).filter(item => item.id !== itemId);
    const totalRencana = updatedItems.reduce((acc, curr) => acc + curr.rencana, 0);
    const totalRealisasi = updatedItems.reduce((acc, curr) => acc + curr.realisasi, 0);

    const updatedProker: Proker = {
      ...selectedBudgetProker,
      rincianAnggaranLPJ: updatedItems,
      anggaran: totalRencana > 0 ? totalRencana : selectedBudgetProker.anggaran,
      terpakai: totalRealisasi,
      lastUpdated: new Date().toLocaleString('id-ID')
    };

    setSelectedBudgetProker(updatedProker);
    onUpdateProker(updatedProker);
  };

  const handleAddIncomeItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBudgetProker || !newIncomeForm.sumber.trim()) return;

    const newIncome: PenerimaanDanaLPJ = {
      id: `pd-${Date.now()}`,
      sumber: newIncomeForm.sumber.trim(),
      nominalRencana: Number(newIncomeForm.nominalRencana) || 0,
      nominalDiterima: Number(newIncomeForm.nominalDiterima) || 0,
      keterangan: newIncomeForm.keterangan.trim() || undefined
    };

    const currentIncome = selectedBudgetProker.penerimaanDanaLPJ || [];
    const updatedIncome = [...currentIncome, newIncome];

    const updatedProker: Proker = {
      ...selectedBudgetProker,
      penerimaanDanaLPJ: updatedIncome,
      lastUpdated: new Date().toLocaleString('id-ID')
    };

    setSelectedBudgetProker(updatedProker);
    onUpdateProker(updatedProker);

    setNewIncomeForm({
      sumber: '',
      nominalRencana: 500000,
      nominalDiterima: 500000,
      keterangan: ''
    });
  };

  const handleDeleteIncomeItem = (incomeId: string) => {
    if (!selectedBudgetProker) return;
    const updatedIncome = (selectedBudgetProker.penerimaanDanaLPJ || []).filter(i => i.id !== incomeId);

    const updatedProker: Proker = {
      ...selectedBudgetProker,
      penerimaanDanaLPJ: updatedIncome,
      lastUpdated: new Date().toLocaleString('id-ID')
    };

    setSelectedBudgetProker(updatedProker);
    onUpdateProker(updatedProker);
  };

  const handleLoadStandardPreset = () => {
    if (!selectedBudgetProker) return;

    const standardExpenses: ItemAnggaranLPJ[] = [
      { id: `rab-${Date.now()}-1`, kategori: 'Kesekretariatan & Cetak', uraian: 'Cetak Spanduk / Banner Backdrop Panggung 4x2m', volume: 1, satuan: 'Spanduk', hargaSatuan: 160000, rencana: 160000, realisasi: 160000, catatanNota: 'Nota Percetakan Digital' },
      { id: `rab-${Date.now()}-2`, kategori: 'Kesekretariatan & Cetak', uraian: 'Fotokopi Proposal, Form Penilaian & Buku Panduan', volume: 60, satuan: 'Buku', hargaSatuan: 5000, rencana: 300000, realisasi: 280000, catatanNota: 'Nota Fotokopi Karunia' },
      { id: `rab-${Date.now()}-3`, kategori: 'Konsumsi Panitia & Peserta', uraian: 'Konsumsi Nasi Kotak Panitia & Tamu Undangan', volume: 45, satuan: 'Kotak', hargaSatuan: 25000, rencana: 1125000, realisasi: 1125000, catatanNota: 'Katering Dapur Barokah' },
      { id: `rab-${Date.now()}-4`, kategori: 'Konsumsi Panitia & Peserta', uraian: 'Air Mineral Gelas & Galon Refill', volume: 5, satuan: 'Dus', hargaSatuan: 28000, rencana: 140000, realisasi: 140000, catatanNota: 'Toko Sumber Rejeki' },
      { id: `rab-${Date.now()}-5`, kategori: 'Perlengkapan & Sound', uraian: 'Sewa Mic Wireless & Kabel Roll Tambahan', volume: 1, satuan: 'Paket', hargaSatuan: 250000, rencana: 250000, realisasi: 250000, catatanNota: 'Sewa Sound Rental Audio' },
      { id: `rab-${Date.now()}-6`, kategori: 'Hadiah, Piala & Piagam', uraian: 'Sertifikat Bingkai Juara & Piala Kejuaraan', volume: 3, satuan: 'Set', hargaSatuan: 150000, rencana: 450000, realisasi: 420000, catatanNota: 'Toko Trophy Juara' },
      { id: `rab-${Date.now()}-7`, kategori: 'Biaya Operasional & Tak Terduga', uraian: 'Baterai Mic, Kertas Karton, Lakban & P3K Medis', volume: 1, satuan: 'Paket', hargaSatuan: 125000, rencana: 125000, realisasi: 110000, catatanNota: 'Minimarket & Apotek' }
    ];

    const standardIncome: PenerimaanDanaLPJ[] = [
      { id: `pd-${Date.now()}-1`, sumber: 'Subsidi Kas Dewan Madrasah Al-Achdan', nominalRencana: 1500000, nominalDiterima: 1500000, keterangan: 'Disetujui Kepala Madrasah' },
      { id: `pd-${Date.now()}-2`, sumber: 'Kontribusi Peserta / Pendaftaran', nominalRencana: 750000, nominalDiterima: 750000, keterangan: 'Kwitansi Panitia' },
      { id: `pd-${Date.now()}-3`, sumber: 'Dana Usaha & Sponsor Mandiri', nominalRencana: 300000, nominalDiterima: 300000, keterangan: 'Bazar OSIS' }
    ];

    const totalRencana = standardExpenses.reduce((acc, curr) => acc + curr.rencana, 0);
    const totalRealisasi = standardExpenses.reduce((acc, curr) => acc + curr.realisasi, 0);

    const updatedProker: Proker = {
      ...selectedBudgetProker,
      rincianAnggaranLPJ: standardExpenses,
      penerimaanDanaLPJ: standardIncome,
      anggaran: totalRencana,
      terpakai: totalRealisasi,
      lastUpdated: new Date().toLocaleString('id-ID')
    };

    setSelectedBudgetProker(updatedProker);
    onUpdateProker(updatedProker);
  };

  // Generate Official LPJ Document with Deep Financial Breakdown
  const handleGenerateLPJ = (p: Proker) => {
    const expenses = p.rincianAnggaranLPJ || [];
    const incomes = p.penerimaanDanaLPJ || [];

    const totalRencanaBiaya = expenses.length > 0 
      ? expenses.reduce((acc, curr) => acc + curr.rencana, 0)
      : p.anggaran;
    
    const totalRealisasiBiaya = expenses.length > 0
      ? expenses.reduce((acc, curr) => acc + curr.realisasi, 0)
      : p.terpakai;

    const totalDanaDiterima = incomes.length > 0
      ? incomes.reduce((acc, curr) => acc + curr.nominalDiterima, 0)
      : totalRencanaBiaya;

    const sisaSaldoKegiatan = totalDanaDiterima - totalRealisasiBiaya;

    const lpjHtml = `
      <div style="font-size: 11pt; line-height: 1.6; font-family: 'Times New Roman', serif;">
        <h3 style="text-align: center; font-size: 13pt; font-weight: bold; margin-bottom: 2pt; text-transform: uppercase;">
          LAPORAN PERTANGGUNGJAWABAN (LPJ) RESMI
        </h3>
        <h4 style="text-align: center; font-size: 12pt; font-weight: bold; margin-top: 0; color: #111;">
          ${p.nama.toUpperCase()}
        </h4>
        <div style="text-align: center; font-size: 10pt; color: #555; margin-bottom: 18pt;">
          Kode Program: ${p.kode} | Dewan Pengarah: ${p.sekbid}
        </div>

        <p><strong>I. PENDAHULUAN & LATAR BELAKANG</strong></p>
        <p style="text-align: justify;">
          Segala puji dan syukur kami panjatkan ke hadirat Allah SWT atas segala limpahan rahmat dan karunia-Nya. Laporan Pertanggungjawaban (LPJ) ini disusun secara transparan, akuntabel, dan sistematis sebagai bentuk pertanggungjawaban amanah pelaksanaan program kerja OSIS ${madrasahInfo.nama} untuk kegiatan: <strong>${p.nama}</strong>.
        </p>

        <p><strong>II. REALISASI & INDIKATOR KEBERHASILAN PROGRAM</strong></p>
        <p style="text-align: justify;">
          ${p.deskripsi}
        </p>
        <p>
          Status Akhir Pelaksanaan: <strong>${p.status}</strong> dengan capaian progres lapangan sebesar <strong>${p.progres}%</strong>.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 8pt; margin-bottom: 12pt;">
          <thead>
            <tr style="background: #f0f0f0;">
              <th style="border: 1px solid #333; padding: 4pt; text-align: center; width: 40px;">No</th>
              <th style="border: 1px solid #333; padding: 4pt;">Tahapan / Milestone Kegiatan</th>
              <th style="border: 1px solid #333; padding: 4pt; text-align: center; width: 120px;">Target Tanggal</th>
              <th style="border: 1px solid #333; padding: 4pt; text-align: center; width: 90px;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${p.milestones.map((m, idx) => `
              <tr>
                <td style="border: 1px solid #333; padding: 4pt; text-align: center;">${idx + 1}</td>
                <td style="border: 1px solid #333; padding: 4pt;">${m.judul}</td>
                <td style="border: 1px solid #333; padding: 4pt; text-align: center;">${m.targetTanggal || '-'}</td>
                <td style="border: 1px solid #333; padding: 4pt; text-align: center; font-weight: bold;">${m.selesai ? 'SELESAI' : 'PROSES'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <p><strong>III. LAPORAN PERTANGGUNGJAWABAN ANGGARAN & BIAYA KEGIATAN</strong></p>
        
        <!-- Tabel Neraca Ringkasan Keuangan -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 6pt; margin-bottom: 14pt;">
          <tr style="background: #f9f9f9;">
            <td style="border: 1px solid #333; padding: 5pt; width: 50%;">A. Total Penerimaan / Sumber Dana:</td>
            <td style="border: 1px solid #333; padding: 5pt; font-weight: bold; color: #15803d; text-align: right;">${formatRupiah(totalDanaDiterima)}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="border: 1px solid #333; padding: 5pt;">B. Total Realisasi Pengeluaran Belanja:</td>
            <td style="border: 1px solid #333; padding: 5pt; font-weight: bold; color: #b91c1c; text-align: right;">${formatRupiah(totalRealisasiBiaya)}</td>
          </tr>
          <tr style="background: #ececec;">
            <td style="border: 1px solid #333; padding: 5pt; font-weight: bold;">C. Sisa Saldo Kas Kegiatan (SILPA / Sisa Dana):</td>
            <td style="border: 1px solid #333; padding: 5pt; font-weight: bold; font-size: 11pt; color: ${sisaSaldoKegiatan >= 0 ? '#15803d' : '#b91c1c'}; text-align: right;">
              ${formatRupiah(sisaSaldoKegiatan)} ${sisaSaldoKegiatan >= 0 ? '(Surplus / Kas Sisa)' : '(Defisit)'}
            </td>
          </tr>
        </table>

        ${incomes.length > 0 ? `
          <p style="margin-top: 10pt; font-size: 10pt;"><strong>Rincian Penerimaan & Sumber Dana Kegiatan:</strong></p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 14pt; font-size: 9.5pt;">
            <thead>
              <tr style="background: #f0f0f0;">
                <th style="border: 1px solid #333; padding: 4pt; width: 35px; text-align: center;">No</th>
                <th style="border: 1px solid #333; padding: 4pt;">Sumber Penerimaan</th>
                <th style="border: 1px solid #333; padding: 4pt; text-align: right;">Rencana (Rp)</th>
                <th style="border: 1px solid #333; padding: 4pt; text-align: right;">Diterima (Rp)</th>
                <th style="border: 1px solid #333; padding: 4pt;">Keterangan / Bukti</th>
              </tr>
            </thead>
            <tbody>
              ${incomes.map((inc, i) => `
                <tr>
                  <td style="border: 1px solid #333; padding: 4pt; text-align: center;">${i + 1}</td>
                  <td style="border: 1px solid #333; padding: 4pt;">${inc.sumber}</td>
                  <td style="border: 1px solid #333; padding: 4pt; text-align: right;">${formatRupiah(inc.nominalRencana)}</td>
                  <td style="border: 1px solid #333; padding: 4pt; text-align: right; font-weight: bold; color: #15803d;">${formatRupiah(inc.nominalDiterima)}</td>
                  <td style="border: 1px solid #333; padding: 4pt; font-size: 8.5pt;">${inc.keterangan || '-'}</td>
                </tr>
              `).join('')}
              <tr style="background: #f5f5f5; font-weight: bold;">
                <td colspan="3" style="border: 1px solid #333; padding: 4pt; text-align: right;">TOTAL DANA DITERIMA:</td>
                <td style="border: 1px solid #333; padding: 4pt; text-align: right; color: #15803d;">${formatRupiah(totalDanaDiterima)}</td>
                <td style="border: 1px solid #333; padding: 4pt;"></td>
              </tr>
            </tbody>
          </table>
        ` : ''}

        ${expenses.length > 0 ? `
          <p style="margin-top: 10pt; font-size: 10pt;"><strong>Rincian Lengkap Pengeluaran Belanja Anggaran LPJ:</strong></p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 14pt; font-size: 9pt;">
            <thead>
              <tr style="background: #f0f0f0;">
                <th style="border: 1px solid #333; padding: 3pt; width: 25px; text-align: center;">No</th>
                <th style="border: 1px solid #333; padding: 3pt; width: 110px;">Pos Kategori</th>
                <th style="border: 1px solid #333; padding: 3pt;">Uraian Belanja & Rincian</th>
                <th style="border: 1px solid #333; padding: 3pt; text-align: center; width: 55px;">Vol</th>
                <th style="border: 1px solid #333; padding: 3pt; text-align: right; width: 75px;">Harga Satuan</th>
                <th style="border: 1px solid #333; padding: 3pt; text-align: right; width: 80px;">Rencana (Rp)</th>
                <th style="border: 1px solid #333; padding: 3pt; text-align: right; width: 80px;">Realisasi (Rp)</th>
                <th style="border: 1px solid #333; padding: 3pt; width: 90px;">No. Bukti / Nota</th>
              </tr>
            </thead>
            <tbody>
              ${expenses.map((exp, idx) => `
                <tr>
                  <td style="border: 1px solid #333; padding: 3pt; text-align: center;">${idx + 1}</td>
                  <td style="border: 1px solid #333; padding: 3pt; font-size: 8pt; color: #444;">${exp.kategori}</td>
                  <td style="border: 1px solid #333; padding: 3pt; font-weight: 500;">${exp.uraian}</td>
                  <td style="border: 1px solid #333; padding: 3pt; text-align: center;">${exp.volume} ${exp.satuan}</td>
                  <td style="border: 1px solid #333; padding: 3pt; text-align: right;">${formatRupiah(exp.hargaSatuan)}</td>
                  <td style="border: 1px solid #333; padding: 3pt; text-align: right;">${formatRupiah(exp.rencana)}</td>
                  <td style="border: 1px solid #333; padding: 3pt; text-align: right; font-weight: bold;">${formatRupiah(exp.realisasi)}</td>
                  <td style="border: 1px solid #333; padding: 3pt; font-size: 7.5pt; font-family: monospace;">${exp.catatanNota || '-'}</td>
                </tr>
              `).join('')}
              <tr style="background: #f5f5f5; font-weight: bold;">
                <td colspan="5" style="border: 1px solid #333; padding: 4pt; text-align: right;">TOTAL PENGELUARAN LPJ:</td>
                <td style="border: 1px solid #333; padding: 4pt; text-align: right;">${formatRupiah(totalRencanaBiaya)}</td>
                <td style="border: 1px solid #333; padding: 4pt; text-align: right; color: #b91c1c;">${formatRupiah(totalRealisasiBiaya)}</td>
                <td style="border: 1px solid #333; padding: 4pt;"></td>
              </tr>
            </tbody>
          </table>
        ` : `
          <table style="width: 100%; border-collapse: collapse; margin-top: 8pt; margin-bottom: 12pt;">
            <tr>
              <td style="border: 1px solid #333; padding: 5pt; width: 50%;">Total Pagu Anggaran Rencana:</td>
              <td style="border: 1px solid #333; padding: 5pt; font-weight: bold;">${formatRupiah(p.anggaran)}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #333; padding: 5pt;">Total Realisasi Pengeluaran:</td>
              <td style="border: 1px solid #333; padding: 5pt; font-weight: bold; color: #b91c1c;">${formatRupiah(p.terpakai)}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #333; padding: 5pt;">Sisa Kas / Efisiensi Anggaran:</td>
              <td style="border: 1px solid #333; padding: 5pt; font-weight: bold; color: #15803d;">${formatRupiah(p.anggaran - p.terpakai)}</td>
            </tr>
          </table>
        `}

        <p><strong>IV. EVALUASI, HAMBATAN & REKOMENDASI</strong></p>
        <p style="text-align: justify; font-style: italic; background: #f9f9f9; padding: 8pt; border-left: 3px solid #C99700;">
          "${p.catatanTerbaru}"
        </p>

        <p style="margin-top: 15pt;">
          Demikian Laporan Pertanggungjawaban ini disusun dengan sebenar-benarnya berdasarkan bukti transaksi yang sah dan dapat dipertanggungjawabkan di hadapan Dewan OSIS dan Kepala Madrasah.
        </p>

        <!-- Tanda Tangan 3 Pihak -->
        <table style="width: 100%; margin-top: 25pt; border-collapse: collapse; border: none; page-break-inside: avoid;">
          <tr>
            <td style="width: 50%; text-align: center; border: none; font-size: 10pt;">
              <div>Mengetahui,</div>
              <div style="font-weight: bold;">Ketua Umum OSIS</div>
              <div style="height: 50px;"></div>
              <div style="font-weight: bold; text-decoration: underline;">${madrasahInfo.ketuaOsis}</div>
              <div style="font-size: 8.5pt; color: #555;">NISN: 0078129340</div>
            </td>
            <td style="width: 50%; text-align: center; border: none; font-size: 10pt;">
              <div>Jawa Barat, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div style="font-weight: bold;">Ketua Panitia Pelaksana / PIC</div>
              <div style="height: 50px;"></div>
              <div style="font-weight: bold; text-decoration: underline;">${p.picNama}</div>
              <div style="font-size: 8.5pt; color: #555;">No. Kontak: ${p.picHp || '-'}</div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: center; padding-top: 20pt; border: none; font-size: 10pt;">
              <div>Mengesahkan / Menyetujui,</div>
              <div style="font-weight: bold;">Kepala ${madrasahInfo.nama}</div>
              <div style="height: 50px;"></div>
              <div style="font-weight: bold; text-decoration: underline;">${madrasahInfo.kepalaMadrasah}</div>
              <div style="font-size: 8.5pt; color: #555;">NIP: ${madrasahInfo.nipKepala}</div>
            </td>
          </tr>
        </table>
      </div>
    `;

    onPreviewPrint({
      title: `LPJ ${p.nama}`,
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      perihal: `Laporan Pertanggungjawaban Realisasi ${p.nama}`,
      contentHtml: lpjHtml,
      tandaTangan: {
        kiri: { jabatan: 'Ketua Umum OSIS', nama: madrasahInfo.ketuaOsis },
        kanan: { jabatan: 'Ketua Panitia / PIC', nama: p.picNama }
      }
    });
  };

  const filteredProker = prokerList.filter(p => {
    if (filterStatus === 'All') return true;
    return p.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            PROGRAM KERJA & SETELAN ANGGARAN LPJ
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pantau milestone kegiatan, atur pos rincian anggaran belanja LPJ, unggah dokumentasi, dan cetak LPJ resmi
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Program Kerja</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#0f172a] p-3 rounded-xl border border-slate-800">
        {['All', 'Sedang Berjalan', 'Disetujui', 'Perencanaan', 'Selesai'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterStatus === status
                ? 'bg-blue-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {status === 'All' ? 'Semua Status' : status}
          </button>
        ))}
      </div>

      {/* Proker Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredProker.map((item) => {
          const budgetItemsCount = item.rincianAnggaranLPJ?.length || 0;
          const incomeItemsCount = item.penerimaanDanaLPJ?.length || 0;

          return (
            <div 
              key={item.id}
              className="bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-md flex flex-col justify-between transition-all"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-blue-400 bg-[#1e293b] px-2 py-0.5 rounded border border-slate-700">
                        {item.kode}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {item.sekbid}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      {item.nama}
                    </h3>
                  </div>

                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold shrink-0 ${
                    item.status === 'Sedang Berjalan' ? 'bg-amber-950/80 text-amber-300 border border-amber-600/40' :
                    item.status === 'Selesai' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                    item.status === 'Disetujui' ? 'bg-blue-950 text-blue-300 border border-blue-600/40' :
                    'bg-slate-900 text-slate-400 border border-slate-700'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {item.deskripsi}
                </p>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-blue-400">Capaian Progres</span>
                    <span className="font-bold text-white">{item.progres}% Selesai</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#1e293b] rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${item.progres}%` }}
                    ></div>
                  </div>
                </div>

                {/* Budget Ledger mini */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
                  <div className="bg-[#1e293b] p-2 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Pagu Anggaran Rencana</span>
                    <div className="font-mono font-bold text-white text-sm">{formatRupiah(item.anggaran)}</div>
                  </div>
                  <div className="bg-[#1e293b] p-2 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Realisasi Belanja LPJ</span>
                    <div className="font-mono font-bold text-amber-300 text-sm">{formatRupiah(item.terpakai)}</div>
                  </div>
                </div>

                {/* Milestones Checklist Interactive */}
                <div className="mt-4 space-y-1.5">
                  <div className="text-[11px] font-mono text-blue-400 uppercase font-bold">
                    Tahapan Kegiatan (Klik untuk checklist):
                  </div>
                  {item.milestones.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleToggleMilestone(item, m.id)}
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-left text-xs transition-colors cursor-pointer border border-slate-700 group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {m.selesai ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-slate-300" />
                        )}
                        <span className={`truncate ${m.selesai ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                          {m.judul}
                        </span>
                      </div>
                      {m.targetTanggal && (
                        <span className="text-[10px] font-mono text-blue-400 shrink-0 ml-2">
                          {m.targetTanggal}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Documentation Photos Preview */}
                {item.fotoDokumentasi.length > 0 && (
                  <div className="mt-4">
                    <div className="text-[11px] font-mono text-blue-400 uppercase mb-2 flex items-center gap-1 font-bold">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Dokumentasi Lapangan ({item.fotoDokumentasi.length} Foto)</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {item.fotoDokumentasi.map((photo) => (
                        <div key={photo.id} className="relative group shrink-0">
                          <img 
                            src={photo.url} 
                            alt={photo.caption} 
                            className="w-20 h-16 object-cover rounded-lg border border-slate-700 shadow"
                          />
                          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-1 text-[9px] text-white flex items-center justify-center text-center">
                            {photo.caption}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] text-slate-400 font-mono">
                  PIC: <span className="text-white font-semibold">{item.picNama}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Button Setelan Anggaran LPJ */}
                  <button
                    onClick={() => handleOpenBudgetModal(item)}
                    title="Atur Rincian Pos Anggaran & Realisasi LPJ"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] text-emerald-400 border border-emerald-600/40 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Anggaran LPJ ({budgetItemsCount})</span>
                  </button>

                  <button
                    onClick={() => handleOpenUpdateModal(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] text-blue-300 border border-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Progres</span>
                  </button>

                  <button
                    onClick={() => handleGenerateLPJ(item)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all shadow"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Cetak LPJ</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL: SETELAN & RINCIAN ANGGARAN BIAYA LPJ */}
      {isBudgetModalOpen && selectedBudgetProker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col my-auto max-h-[92vh]">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0b1120] rounded-t-2xl flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#1e293b] border border-slate-700 text-emerald-400">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-wider">
                    SETELAN ANGGARAN & REALISASI BIAYA LPJ
                  </h3>
                  <p className="text-xs text-blue-400">
                    {selectedBudgetProker.nama} • {selectedBudgetProker.kode}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadStandardPreset}
                  title="Muat Contoh Rincian Anggaran Standar Kegiatan Sekolah"
                  className="px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] text-slate-200 border border-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Muat Contoh Standar
                </button>
                <button
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-Header Tabs & Quick Balance */}
            <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveBudgetTab('pengeluaran')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeBudgetTab === 'pengeluaran'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Rincian Pengeluaran Belanja ({selectedBudgetProker.rincianAnggaranLPJ?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveBudgetTab('penerimaan')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeBudgetTab === 'penerimaan'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>Sumber Dana & Penerimaan ({selectedBudgetProker.penerimaanDanaLPJ?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveBudgetTab('ringkasan')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeBudgetTab === 'ringkasan'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Neraca Rekapitulasi</span>
                </button>
              </div>

              {/* Financial Summary Badges */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block">Rencana:</span>
                  <span className="font-bold text-white">
                    {formatRupiah((selectedBudgetProker.rincianAnggaranLPJ || []).reduce((acc, c) => acc + c.rencana, 0))}
                  </span>
                </div>
                <div className="text-slate-700">|</div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Realisasi:</span>
                  <span className="font-bold text-emerald-400">
                    {formatRupiah((selectedBudgetProker.rincianAnggaranLPJ || []).reduce((acc, c) => acc + c.realisasi, 0))}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-5 overflow-y-auto space-y-6">

              {/* TAB 1: PENGELUARAN BELANJA LPJ */}
              {activeBudgetTab === 'pengeluaran' && (
                <div className="space-y-5">
                  {/* Form Input Item Anggaran Baru */}
                  <form onSubmit={handleAddBudgetItem} className="bg-[#0b1120] border border-slate-700 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <PlusCircle className="w-4 h-4" />
                        Tambah Pos Pengeluaran / Belanja LPJ
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Perhitungan Otomatis: Vol × Harga Satuan
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">
                          Pos Kategori Anggaran
                        </label>
                        <select
                          value={newExpenseForm.kategori}
                          onChange={(e) => setNewExpenseForm({ ...newExpenseForm, kategori: e.target.value as any })}
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        >
                          {KATEGORI_LPJ_LIST.map((kat) => (
                            <option key={kat} value={kat}>{kat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-slate-300 mb-1">
                          Uraian Belanja / Kegiatan
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Konsumsi Nasi Kotak Panitia & Tamu"
                          value={newExpenseForm.uraian}
                          onChange={(e) => setNewExpenseForm({ ...newExpenseForm, uraian: e.target.value })}
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">
                          Volume (Qty)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={newExpenseForm.volume}
                          onChange={(e) => setNewExpenseForm({ ...newExpenseForm, volume: Math.max(1, Number(e.target.value)) })}
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">
                          Satuan
                        </label>
                        <input
                          type="text"
                          placeholder="Kotak/Buku/Rim/Pcs"
                          value={newExpenseForm.satuan}
                          onChange={(e) => setNewExpenseForm({ ...newExpenseForm, satuan: e.target.value })}
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">
                          Harga Satuan (Rp)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          value={newExpenseForm.hargaSatuan}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setNewExpenseForm({ 
                              ...newExpenseForm, 
                              hargaSatuan: val,
                              realisasi: val * newExpenseForm.volume
                            });
                          }}
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">
                          Realisasi Pengeluaran (Rp)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          value={newExpenseForm.realisasi}
                          onChange={(e) => setNewExpenseForm({ ...newExpenseForm, realisasi: Number(e.target.value) })}
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-mono font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-slate-300 mb-1">
                          Nomor Nota / Bukti Kwitansi Terlampir (Opsional)
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Nota Katering No. 04 / Kwitansi Toko Juara"
                          value={newExpenseForm.catatanNota}
                          onChange={(e) => setNewExpenseForm({ ...newExpenseForm, catatanNota: e.target.value })}
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Simpan Item Anggaran</span>
                      </button>
                    </div>
                  </form>

                  {/* Tabel Rincian Belanja yang Sudah Diinput */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Receipt className="w-4 h-4 text-emerald-400" />
                        Daftar Rincian Pengeluaran Belanja Kegiatan
                      </h4>
                      <span className="text-xs text-slate-400 font-mono">
                        {(selectedBudgetProker.rincianAnggaranLPJ || []).length} Pos Biaya Terdaftar
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0b1120]">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#1e293b] text-slate-300 font-mono border-b border-slate-800">
                          <tr>
                            <th className="p-2.5 text-center w-10">No</th>
                            <th className="p-2.5">Kategori & Uraian Biaya</th>
                            <th className="p-2.5 text-center">Volume</th>
                            <th className="p-2.5 text-right">Harga Satuan</th>
                            <th className="p-2.5 text-right">Rencana</th>
                            <th className="p-2.5 text-right">Realisasi</th>
                            <th className="p-2.5 text-right">Selisih</th>
                            <th className="p-2.5">No. Nota</th>
                            <th className="p-2.5 text-center w-14">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {(selectedBudgetProker.rincianAnggaranLPJ && selectedBudgetProker.rincianAnggaranLPJ.length > 0) ? (
                            selectedBudgetProker.rincianAnggaranLPJ.map((item, idx) => {
                              const selisih = item.rencana - item.realisasi;
                              return (
                                <tr key={item.id} className="hover:bg-[#1e293b]/60 transition-colors">
                                  <td className="p-2.5 text-center text-slate-400 font-mono">{idx + 1}</td>
                                  <td className="p-2.5">
                                    <div className="font-semibold text-white">{item.uraian}</div>
                                    <div className="text-[10px] text-slate-400">{item.kategori}</div>
                                  </td>
                                  <td className="p-2.5 text-center font-mono text-slate-300">
                                    {item.volume} {item.satuan}
                                  </td>
                                  <td className="p-2.5 text-right font-mono text-slate-300">
                                    {formatRupiah(item.hargaSatuan)}
                                  </td>
                                  <td className="p-2.5 text-right font-mono text-white">
                                    {formatRupiah(item.rencana)}
                                  </td>
                                  <td className="p-2.5 text-right font-mono font-bold text-emerald-400">
                                    {formatRupiah(item.realisasi)}
                                  </td>
                                  <td className={`p-2.5 text-right font-mono text-[11px] ${selisih >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {selisih >= 0 ? `+${formatRupiah(selisih)}` : formatRupiah(selisih)}
                                  </td>
                                  <td className="p-2.5 font-mono text-[10px] text-slate-400">
                                    {item.catatanNota || '-'}
                                  </td>
                                  <td className="p-2.5 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteBudgetItem(item.id)}
                                      className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                                      title="Hapus pos belanja ini"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={9} className="p-8 text-center text-slate-400">
                                <Receipt className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                                <p>Belum ada rincian pos belanja LPJ yang dimasukkan.</p>
                                <p className="text-[11px] text-[#E5A93C] mt-1">
                                  Gunakan formulir di atas atau klik tombol "Muat Contoh Standar" untuk mengisi otomatis.
                                </p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SUMBER DANA & PENERIMAAN LPJ */}
              {activeBudgetTab === 'penerimaan' && (
                <div className="space-y-5">
                  <form onSubmit={handleAddIncomeItem} className="bg-[#0b1120] border border-slate-700 rounded-xl p-4 space-y-3">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                      Catat Sumber Dana / Penerimaan Kas Kegiatan
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">
                          Sumber Penerimaan
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Subsidi Kas Madrasah / Sponsor"
                          value={newIncomeForm.sumber}
                          onChange={(e) => setNewIncomeForm({ ...newIncomeForm, sumber: e.target.value })}
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">
                          Nominal Rencana (Rp)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="10000"
                          value={newIncomeForm.nominalRencana}
                          onChange={(e) => setNewIncomeForm({ ...newIncomeForm, nominalRencana: Number(e.target.value) })}
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">
                          Nominal Diterima Riil (Rp)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="10000"
                          value={newIncomeForm.nominalDiterima}
                          onChange={(e) => setNewIncomeForm({ ...newIncomeForm, nominalDiterima: Number(e.target.value) })}
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-mono font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-slate-300 mb-1">
                          Keterangan / Nomor Bukti Transfer
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Transfer Rekening Bank BSI / Kwitansi Komite"
                          value={newIncomeForm.keterangan}
                          onChange={(e) => setNewIncomeForm({ ...newIncomeForm, keterangan: e.target.value })}
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Penerimaan</span>
                      </button>
                    </div>
                  </form>

                  {/* List Penerimaan */}
                  <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0b1120]">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#1e293b] text-slate-300 font-mono border-b border-slate-800">
                        <tr>
                          <th className="p-2.5 text-center w-10">No</th>
                          <th className="p-2.5">Sumber Dana</th>
                          <th className="p-2.5 text-right">Rencana (Rp)</th>
                          <th className="p-2.5 text-right">Diterima Riil (Rp)</th>
                          <th className="p-2.5">Keterangan</th>
                          <th className="p-2.5 text-center w-14">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {(selectedBudgetProker.penerimaanDanaLPJ && selectedBudgetProker.penerimaanDanaLPJ.length > 0) ? (
                          selectedBudgetProker.penerimaanDanaLPJ.map((inc, idx) => (
                            <tr key={inc.id} className="hover:bg-[#1e293b]/60 transition-colors">
                              <td className="p-2.5 text-center text-slate-400 font-mono">{idx + 1}</td>
                              <td className="p-2.5 font-bold text-white">{inc.sumber}</td>
                              <td className="p-2.5 text-right font-mono text-slate-300">{formatRupiah(inc.nominalRencana)}</td>
                              <td className="p-2.5 text-right font-mono font-bold text-emerald-400">{formatRupiah(inc.nominalDiterima)}</td>
                              <td className="p-2.5 text-slate-400">{inc.keterangan || '-'}</td>
                              <td className="p-2.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteIncomeItem(inc.id)}
                                  className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400">
                              Belum ada sumber penerimaan yang tercatat.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: NERACA REKAPITULASI KEUANGAN LPJ */}
              {activeBudgetTab === 'ringkasan' && (
                <div className="space-y-4">
                  {(() => {
                    const totalExpenses = (selectedBudgetProker.rincianAnggaranLPJ || []).reduce((acc, c) => acc + c.realisasi, 0);
                    const totalIncomes = (selectedBudgetProker.penerimaanDanaLPJ || []).reduce((acc, c) => acc + c.nominalDiterima, 0);
                    const silpa = totalIncomes - totalExpenses;

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-[#0b1120] border border-slate-800 p-4 rounded-xl">
                          <div className="text-[11px] text-slate-400 uppercase font-mono mb-1">Total Dana Masuk</div>
                          <div className="text-xl font-bold font-mono text-emerald-400">{formatRupiah(totalIncomes)}</div>
                          <div className="text-[10px] text-slate-500 mt-1">Dari {selectedBudgetProker.penerimaanDanaLPJ?.length || 0} sumber dana</div>
                        </div>

                        <div className="bg-[#0b1120] border border-slate-800 p-4 rounded-xl">
                          <div className="text-[11px] text-slate-400 uppercase font-mono mb-1">Total Belanja Realisasi</div>
                          <div className="text-xl font-bold font-mono text-rose-400">{formatRupiah(totalExpenses)}</div>
                          <div className="text-[10px] text-slate-500 mt-1">Dari {selectedBudgetProker.rincianAnggaranLPJ?.length || 0} pos belanja</div>
                        </div>

                        <div className={`p-4 rounded-xl border ${silpa >= 0 ? 'bg-emerald-950/20 border-emerald-600/40' : 'bg-rose-950/20 border-rose-600/40'}`}>
                          <div className="text-[11px] text-slate-400 uppercase font-mono mb-1">Sisa Saldo Kas (SILPA)</div>
                          <div className={`text-xl font-bold font-mono ${silpa >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                            {formatRupiah(silpa)}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            {silpa >= 0 ? 'Kas surplus / dana sisa disimpan ke kas OSIS' : 'Defisit pembiayaan kegiatan'}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="bg-[#0b1120] p-4 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      Kesesuaian dengan Dokumen Cetak LPJ
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Seluruh rincian pos anggaran belanja dan penerimaan yang dimasukkan di atas akan <strong>secara otomatis dimuat dalam Dokumen Resmi Laporan Pertanggungjawaban (LPJ)</strong> ketika Anda menekan tombol <strong>"Cetak LPJ"</strong>, lengkap dengan tabel rincian harga satuan, volume, nomor nota, perbandingan rencana vs realisasi, dan kolom tanda tangan Kepala Madrasah.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 border-t border-slate-800 bg-[#0b1120] rounded-b-2xl flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Data otomatis tersimpan & terhubung dengan Laporan Resmi
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsBudgetModalOpen(false);
                    handleGenerateLPJ(selectedBudgetProker);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg cursor-pointer shadow flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Preview Cetak LPJ Sekarang</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Real-time Field Update Modal */}
      {isUpdateModalOpen && selectedProker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  UPDATE PROGRES KEGIATAN LAPANGAN
                </h3>
                <p className="text-xs text-blue-400">
                  {selectedProker.nama}
                </p>
              </div>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Persentase Penyelesaian:</span>
                <span className="font-bold font-mono text-blue-400">{reportProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={reportProgress}
                onChange={(e) => setReportProgress(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Total Biaya Terpakai (Rp)
              </label>
              <input
                type="number"
                value={reportSpent}
                onChange={(e) => setReportSpent(Number(e.target.value))}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Tip: Anda juga dapat menggunakan tombol <strong className="text-emerald-400">"Anggaran LPJ"</strong> di kartu proker untuk merinci belanja per pos secara otomatis.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Catatan Kondisi Terkini / Laporan Lapangan
              </label>
              <textarea
                rows={3}
                value={reportNote}
                onChange={(e) => setReportNote(e.target.value)}
                placeholder="Contoh: Panitia telah menyiapkan lokasi kegiatan, peserta telah terdaftar..."
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Upload Foto Dokumentasi */}
            <div className="p-3 bg-[#1e293b] rounded-xl border border-slate-700 space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Upload Foto Dokumentasi Lapangan:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="text-xs text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
              {uploadedPhotoUrl && (
                <div className="space-y-2 pt-2">
                  <img 
                    src={uploadedPhotoUrl} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded-lg border border-slate-700" 
                  />
                  <input
                    type="text"
                    placeholder="Tuliskan keterangan foto (caption)..."
                    value={uploadedPhotoCaption}
                    onChange={(e) => setUploadedPhotoCaption(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveUpdate}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg cursor-pointer shadow"
              >
                Simpan Progres
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Proker Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  TAMBAH PROGRAM KERJA BARU
                </h3>
                <p className="text-xs text-slate-400">
                  Definisikan program kerja, target tanggal, pagu anggaran, dan penanggung jawab (PIC)
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewProker} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kode Program
                  </label>
                  <input
                    type="text"
                    value={newProkerData.kode}
                    onChange={(e) => setNewProkerData({ ...newProkerData, kode: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Divisi / Sekbid
                  </label>
                  <input
                    type="text"
                    value={newProkerData.sekbid}
                    onChange={(e) => setNewProkerData({ ...newProkerData, sekbid: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    placeholder="Contoh: Sekbid 6 (Sarana & Prasarana)"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Program Kerja
                </label>
                <input
                  type="text"
                  value={newProkerData.nama}
                  onChange={(e) => setNewProkerData({ ...newProkerData, nama: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="Contoh: Turnamen Futsal Antar-Kelas Milad Madrasah"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Deskripsi & Tujuan
                </label>
                <textarea
                  rows={2}
                  value={newProkerData.deskripsi}
                  onChange={(e) => setNewProkerData({ ...newProkerData, deskripsi: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  placeholder="Jelaskan tujuan dan sasaran kegiatan..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Alokasi Pagu Anggaran (Rp)
                  </label>
                  <input
                    type="number"
                    value={newProkerData.anggaran}
                    onChange={(e) => setNewProkerData({ ...newProkerData, anggaran: Number(e.target.value) })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Target Tanggal Pelaksanaan
                  </label>
                  <input
                    type="date"
                    value={newProkerData.targetTanggal}
                    onChange={(e) => setNewProkerData({ ...newProkerData, targetTanggal: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Penanggung Jawab (PIC)
                  </label>
                  <input
                    type="text"
                    value={newProkerData.picNama}
                    onChange={(e) => setNewProkerData({ ...newProkerData, picNama: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    No. HP PIC
                  </label>
                  <input
                    type="text"
                    value={newProkerData.picHp}
                    onChange={(e) => setNewProkerData({ ...newProkerData, picHp: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg cursor-pointer shadow"
                >
                  Simpan Program Kerja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
