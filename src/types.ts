export type JabatanOsis = 
  | 'Ketua Umum OSIS' 
  | 'Wakil Ketua OSIS' 
  | 'Sekretaris Umum' 
  | 'Sekretaris I' 
  | 'Bendahara Umum' 
  | 'Bendahara I' 
  | 'Koordinator Sekbid 1 (Ketaqwaan & Rohis)' 
  | 'Koordinator Sekbid 2 (Kedisiplinan & Budi Pekerti)' 
  | 'Koordinator Sekbid 3 (Kepemimpinan & Wawasan Kebangsaan)' 
  | 'Koordinator Sekbid 4 (Prestasi Akademik & Iptek)' 
  | 'Koordinator Sekbid 5 (Demokrasi, HAM & Pendidikan Politik)' 
  | 'Koordinator Sekbid 6 (Kreativitas & Kewirausahaan)' 
  | 'Koordinator Sekbid 7 (Jasmani, Kesehatan & Olahraga)' 
  | 'Koordinator Sekbid 8 (Apresiasi Seni & Budaya)' 
  | 'Koordinator Sekbid 9 (TIK, Humas & Publikasi)' 
  | 'Koordinator Sekbid 10 (Komunikasi Bahasa Asing)';

export interface Pengurus {
  id: string;
  nomorAnggota: string; // e.g. "KTA-ACHDAN-001"
  nama: string;
  nisn: string;
  kelas: string;
  jabatan: string;
  sekbid: string;
  noHp: string;
  email: string;
  fotoUrl: string;
  status: 'Aktif' | 'Alumni' | 'Demisioner';
  motto: string;
  tanggalLantik: string;
  // Optional legacy fields for backward compatibility
  hunterId?: string;
  councilRole?: string;
  houseSigil?: string;
  nenType?: string;
  rank?: string;
}

export interface AspirasiSiswa {
  id: string;
  namaPengirim: string;
  kelas: string;
  tanggal: string;
  kategori: 'Fasilitas & Sarpras' | 'KBM & Akademik' | 'Kegiatan OSIS' | 'Kantin & Lingkungan' | 'Aspirasi Terbuka';
  judul: string;
  isiAspirasi: string;
  status: 'Menunggu Dewan' | 'Diproses' | 'Direalisasikan' | 'Arsip';
  tanggapanDewan?: string;
  upvotes: number;
}

export interface SertifikatItem {
  id: string;
  nomorSertifikat: string;
  namaPenerima: string;
  nisn?: string;
  kelas?: string;
  peranSebagai: 'Juara 1' | 'Juara 2' | 'Juara 3' | 'Peserta Berprestasi' | 'Panitia Pelaksana' | 'Pengurus Berdedikasi' | 'Narasumber';
  namaKegiatan: string;
  tanggalTerbit: string;
  deskripsiPrestasi: string;
  penandatangan1: string; // Kepala Madrasah
  penandatangan2: string; // Ketua OSIS
}

export interface PengaturanMadrasah {
  nama: string;
  yayasan: string;
  npsn: string;
  alamat: string;
  telepon: string;
  email: string;
  periode: string;
  kepalaMadrasah: string;
  nipKepala: string;
  pembinaOsis: string;
  nipPembina: string;
  ketuaOsis: string;
  creator: string;
  creatorRole: string;
  mottoMadrasah: string;
  logoMadrasahUrl: string;
  logoOsisUrl: string;
  logoUrl?: string;
}

export interface SuratItem {
  id: string;
  nomorSurat: string;
  jenis: 'Surat Masuk' | 'Surat Keluar';
  klasifikasi: 'Undangan' | 'Permohonan Izin' | 'Peminjaman' | 'Pemberitahuan' | 'Mandat/Tugas' | 'Sponsorship';
  perihal: string;
  tujuanPengirim: string;
  tanggal: string;
  statusDisposisi: 'Diproses' | 'Disetujui' | 'Diarsipkan' | 'Menunggu TTD Pembina';
  ringkasan: string;
  fileLampiranNama?: string;
  fileLampiranUrl?: string;
  isiLengkap?: string;
  tempat?: string;
  waktu?: string;
  penandatanganNama?: string;
}

export interface ItemAnggaranLPJ {
  id: string;
  kategori: 
    | 'Kesekretariatan & Cetak' 
    | 'Konsumsi Panitia & Peserta' 
    | 'Perlengkapan & Sound' 
    | 'Hadiah, Piala & Piagam' 
    | 'Transport & Akomodasi' 
    | 'Honorarium Juri/Pemateri' 
    | 'Dekorasi & Dokumentasi' 
    | 'Biaya Operasional & Tak Terduga';
  uraian: string;
  volume: number;
  satuan: string;
  hargaSatuan: number;
  rencana: number;
  realisasi: number;
  catatanNota?: string;
}

export interface PenerimaanDanaLPJ {
  id: string;
  sumber: string;
  nominalRencana: number;
  nominalDiterima: number;
  keterangan?: string;
}

export interface Milestone {
  id: string;
  judul: string;
  selesai: boolean;
  targetTanggal: string;
}

export interface Proker {
  id: string;
  kode: string;
  nama: string;
  sekbid: string;
  deskripsi: string;
  status: 'Perencanaan' | 'Pengajuan Proposal' | 'Disetujui' | 'Sedang Berjalan' | 'Selesai' | 'LPJ Dievaluasi';
  targetTanggal: string;
  progres: number; // 0 - 100
  anggaran: number;
  terpakai: number;
  rincianAnggaranLPJ?: ItemAnggaranLPJ[];
  penerimaanDanaLPJ?: PenerimaanDanaLPJ[];
  picNama: string;
  picHp: string;
  milestones: Milestone[];
  fotoDokumentasi: { id: string; url: string; caption: string; tanggal: string }[];
  catatanTerbaru: string;
  lastUpdated: string;
}

export interface PeminjamanBarang {
  id: string;
  namaPeminjam: string;
  kontak: string;
  instansiKelas: string;
  jumlah: number;
  tanggalPinjam: string;
  tenggatKembali: string;
  tanggalKembaliReal?: string;
  status: 'Sedang Dipinjam' | 'Dikembalikan' | 'Terlambat';
  keperluan: string;
  petugasOsis: string;
}

export type RiwayatPinjam = PeminjamanBarang;

export interface InventarisItem {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  kategori: 'Elektronik & Sound' | 'Peralatan Acara' | 'Dokumentasi & Media' | 'Alat Tulis & Kantor' | 'Kebersihan & Medis';
  jumlahTotal: number;
  jumlahTersedia: number;
  kondisi: 'Baik' | 'Perlu Servis' | 'Rusak';
  lokasiPenyimpanan: string;
  fotoUrl: string;
  riwayatPinjam: PeminjamanBarang[];
  keterangan: string;
}

export interface KasTransaksi {
  id: string;
  tanggal: string;
  jenis: 'Pemasukan' | 'Pengeluaran';
  kategori: 'Iuran Pengurus' | 'Dana Madrasah' | 'Sponsorship & Donatur' | 'Dana Usaha' | 'Operasional & Konsumsi' | 'Perlengkapan Acara' | 'Administrasi & Cetak' | 'Lain-lain';
  nominal: number;
  keterangan: string;
  pic: string;
  createdBy?: string;
  buktiNotaUrl?: string;
  nomorKwitansi: string;
}

export interface PresensiItem {
  id: string;
  pengurusId: string;
  nama: string;
  jabatan: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
  keterangan?: string;
}

export interface NotulensiRapat {
  id: string;
  nomorNotulen: string;
  judulRapat: string;
  tanggal: string;
  waktu: string;
  tempat: string;
  pemimpinRapat: string;
  notulis: string;
  agenda: string;
  pembahasan: string;
  hasilKeputusan: string[];
  tindakLanjut: string;
  presensi: PresensiItem[];
  status: 'Final' | 'Draft';
}

export interface BerkasDrive {
  id: string;
  namaFile: string;
  kategori: 'Proposal' | 'LPJ' | 'Surat & SK' | 'Template' | 'Foto Kegiatan' | 'Arsip Lain';
  ukuran: string;
  tipe: string;
  tanggalUnggah: string;
  dataUrl: string;
  pengunggah: string;
  keterangan: string;
}
