import { 
  Pengurus, 
  SuratItem, 
  Proker, 
  InventarisItem, 
  KasTransaksi, 
  NotulensiRapat, 
  BerkasDrive,
  AspirasiSiswa,
  SertifikatItem,
  PengaturanMadrasah
} from '../types';

import madrasahLogo from '../assets/images/madrasah_logo_1791115779583.jpg';
import osisLogo from '../assets/images/osis_logo_1791115792715.jpg';

export const MADRASAH_INFO: PengaturanMadrasah = {
  nama: 'MADRASAH AL-ACHDAN',
  yayasan: 'LEMBAGA PENDIDIKAN ISLAM AL-ACHDAN',
  npsn: '20261994',
  alamat: 'Jl. Pendidikan Karakter Islami No. 128, Kompleks Al-Achdan, Jawa Barat',
  telepon: '(022) 8765-4321',
  email: 'osis@madrasah-alachdan.sch.id',
  periode: 'Masa Bakti 2026/2027',
  kepalaMadrasah: 'Drs. H. Ahmad Farhan, M.Pd.',
  nipKepala: '19750812 200212 1 003',
  pembinaOsis: 'Ust. Ridwan Kamiludin, S.Ag., M.Pd.I.',
  nipPembina: '19880415 201101 1 005',
  ketuaOsis: 'Muhammad Rayhan Al-Fatih',
  creator: 'Nandi Achdarizal Sutisna',
  creatorRole: 'Sekretaris Umum & Pengembang Sistem Informasi OSIS',
  mottoMadrasah: 'Berakhlak Mulia, Cerdas, Terampil, dan Berintegritas Tinggi',
  logoMadrasahUrl: madrasahLogo,
  logoOsisUrl: osisLogo,
  logoUrl: madrasahLogo
};

export const INITIAL_PENGURUS: Pengurus[] = [
  {
    id: 'p-1',
    nomorAnggota: 'KTA-ACHDAN-001',
    nama: 'Muhammad Rayhan Al-Fatih',
    nisn: '0078129340',
    kelas: 'XI MIPA 1',
    jabatan: 'Ketua Umum OSIS',
    sekbid: 'Badan Pengurus Harian (BPH)',
    noHp: '0812-3456-7890',
    email: 'rayhan.fatih@siswa.alachdan.id',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    status: 'Aktif',
    motto: 'Memimpin dengan keteladanan, melayani dengan keikhlasan.',
    tanggalLantik: '2026-08-15'
  },
  {
    id: 'p-2',
    nomorAnggota: 'KTA-ACHDAN-002',
    nama: 'Siti Aisyah Azzahra',
    nisn: '0078234190',
    kelas: 'XI IPS 1',
    jabatan: 'Wakil Ketua OSIS',
    sekbid: 'Badan Pengurus Harian (BPH)',
    noHp: '0813-8877-2211',
    email: 'aisyah.azzahra@siswa.alachdan.id',
    fotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    status: 'Aktif',
    motto: 'Mewujudkan OSIS yang aspiratif, solid, dan solutif bagi seluruh siswa.',
    tanggalLantik: '2026-08-15'
  },
  {
    id: 'p-3',
    nomorAnggota: 'KTA-ACHDAN-003',
    nama: 'Nandi Achdarizal Sutisna',
    nisn: '0078345911',
    kelas: 'XI MIPA 2',
    jabatan: 'Sekretaris Umum',
    sekbid: 'Badan Pengurus Harian (BPH) & Tim Digitalisasi',
    noHp: '0821-9988-7766',
    email: 'nandi.achdarizal@siswa.alachdan.id',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    status: 'Aktif',
    motto: 'Administrasi rapi, tertib berkas, dan digitalisasi transparan untuk kemajuan madrasah.',
    tanggalLantik: '2026-08-15'
  },
  {
    id: 'p-4',
    nomorAnggota: 'KTA-ACHDAN-004',
    nama: 'Fatimah Az-Zuhra',
    nisn: '0078456102',
    kelas: 'XI Keagamaan',
    jabatan: 'Bendahara Umum',
    sekbid: 'Badan Pengurus Harian (BPH) & Keuangan',
    noHp: '0857-1122-3344',
    email: 'fatimah.zuhra@siswa.alachdan.id',
    fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    status: 'Aktif',
    motto: 'Akuntabilitas dan amanah dalam setiap rupiah anggaran kegiatan siswa.',
    tanggalLantik: '2026-08-15'
  },
  {
    id: 'p-5',
    nomorAnggota: 'KTA-ACHDAN-005',
    nama: 'Dimas Bagas Pratama',
    nisn: '0081234901',
    kelas: 'X-1',
    jabatan: 'Koordinator Sekbid 6 (Kewirausahaan & Sarana)',
    sekbid: 'Seksi Bidang 6 (Sarana, Perlengkapan & Dana Usaha)',
    noHp: '0819-3344-5566',
    email: 'dimas.bagas@siswa.alachdan.id',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    status: 'Aktif',
    motto: 'Kesiapsiagaan logistik adalah pondasi suksesnya setiap agenda madrasah.',
    tanggalLantik: '2026-08-15'
  },
  {
    id: 'p-6',
    nomorAnggota: 'KTA-ACHDAN-006',
    nama: 'Syifa Nurul Ilmi',
    nisn: '0079348123',
    kelas: 'XI IPS 2',
    jabatan: 'Koordinator Sekbid 9 (TIK, Humas & Publikasi)',
    sekbid: 'Seksi Bidang 9 (Publikasi, Dokumentasi & Media)',
    noHp: '0878-5566-7788',
    email: 'syifa.nurul@siswa.alachdan.id',
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    status: 'Aktif',
    motto: 'Mengabarkan setiap prestasi dan inspirasi siswa ke seluruh penjuru masyarakat.',
    tanggalLantik: '2026-08-15'
  },
  {
    id: 'p-7',
    nomorAnggota: 'KTA-ACHDAN-007',
    nama: 'Zikri Maulana Hakim',
    nisn: '0082345678',
    kelas: 'X-3',
    jabatan: 'Koordinator Sekbid 2 (Kedisiplinan & Budi Pekerti)',
    sekbid: 'Seksi Bidang 2 (Ketertiban, Kedisiplinan & Tata Tertib)',
    noHp: '0896-1234-9876',
    email: 'zikri.hakim@siswa.alachdan.id',
    fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    status: 'Aktif',
    motto: 'Disiplin adalah kunci kemuliaan akhlak dan keberhasilan belajar.',
    tanggalLantik: '2026-08-15'
  }
];

export const INITIAL_PROKER: Proker[] = [
  {
    id: 'proker-1',
    kode: 'PROKER-OSIS-01',
    nama: 'Latihan Dasar Kepemimpinan Siswa (LDKS) 2026',
    sekbid: 'Badan Pengurus Harian (BPH)',
    deskripsi: 'Latihan Dasar Kepemimpinan Siswa gabungan OSIS & MPK dengan materi kepemimpinan, wawasan kebangsaan, akhlakul karimah, manajemen organisasi, dan outbond kebersamaan.',
    status: 'Sedang Berjalan',
    targetTanggal: '2026-10-18',
    progres: 78,
    anggaran: 4500000,
    terpakai: 3250000,
    picNama: 'Muhammad Rayhan Al-Fatih',
    picHp: '0812-3456-7890',
    milestones: [
      { id: 'm-1', judul: 'Penyusunan Proposal & Persetujuan Kepala Madrasah', selesai: true, targetTanggal: '2026-09-10' },
      { id: 'm-2', judul: 'Survei Lokasi Perkemahan & Uji Keamanan Rute', selesai: true, targetTanggal: '2026-09-20' },
      { id: 'm-3', judul: 'Seleksi Calon Pengurus OSIS Angkatan Baru', selesai: true, targetTanggal: '2026-10-01' },
      { id: 'm-4', judul: 'Penerbitan KTA OSIS & Pembagian Perlengkapan', selesai: false, targetTanggal: '2026-10-12' },
      { id: 'm-5', judul: 'Pelaksanaan 3 Hari 2 Malam & Pelantikan Resmi', selesai: false, targetTanggal: '2026-10-18' }
    ],
    penerimaanDanaLPJ: [
      { id: 'pd-1', sumber: 'Subsidi Kas Komite & Madrasah Al-Achdan', nominalRencana: 2500000, nominalDiterima: 2500000, keterangan: 'Transfer Rekening Mandiri No. 131-00-12' },
      { id: 'pd-2', sumber: 'Kontribusi & Iuran Mandiri Calon Peserta (50 Siswa)', nominalRencana: 1500000, nominalDiterima: 1500000, keterangan: 'Kwitansi Iuran No. KW-LDKS-01' },
      { id: 'pd-3', sumber: 'Sponsorship CV Mitra Mandiri Perkasa', nominalRencana: 500000, nominalDiterima: 500000, keterangan: 'Donasi Pembinaan Generasi Muda' }
    ],
    rincianAnggaranLPJ: [
      { id: 'rab-1', kategori: 'Kesekretariatan & Cetak', uraian: 'Cetak Modul Kepemimpinan & Buku Panduan LDKS', volume: 55, satuan: 'Buku', hargaSatuan: 15000, rencana: 825000, realisasi: 800000, catatanNota: 'Nota Percetakan Barokah No. 441' },
      { id: 'rab-2', kategori: 'Kesekretariatan & Cetak', uraian: 'ID Card Peserta & Panitia + Tali Lanyard Resmi', volume: 65, satuan: 'Pcs', hargaSatuan: 5000, rencana: 325000, realisasi: 325000, catatanNota: 'Nota Digital Print No. 102' },
      { id: 'rab-3', kategori: 'Konsumsi Panitia & Peserta', uraian: 'Konsumsi Makan 3 Hari (Prasmanan & Box)', volume: 65, satuan: 'Paket', hargaSatuan: 25000, rencana: 1625000, realisasi: 1400000, catatanNota: 'Katering Dapur Ibu Hj. Halimah' },
      { id: 'rab-4', kategori: 'Konsumsi Panitia & Peserta', uraian: 'Snack Rebusan & Air Mineral Galon Refill', volume: 6, satuan: 'Galon', hargaSatuan: 20000, rencana: 120000, realisasi: 120000, catatanNota: 'Depot Air Sehat Al-Achdan' },
      { id: 'rab-5', kategori: 'Transport & Akomodasi', uraian: 'Sewa Armada Pengangkut Peserta PP', volume: 2, satuan: 'Unit', hargaSatuan: 400000, rencana: 800000, realisasi: 750000, catatanNota: 'Kwitansi Transportasi Bus Sekolah' },
      { id: 'rab-6', kategori: 'Hadiah, Piala & Piagam', uraian: 'Trophy Peserta Terbaik & Sertifikat Kelulusan', volume: 3, satuan: 'Set', hargaSatuan: 100000, rencana: 300000, realisasi: 300000, catatanNota: 'Toko Piala Juara Cemerlang' },
      { id: 'rab-7', kategori: 'Biaya Operasional & Tak Terduga', uraian: 'Obat P3K, Baterai HT & Minyak Tanah Api Unggun', volume: 1, satuan: 'Paket', hargaSatuan: 205000, rencana: 205000, realisasi: 180000, catatanNota: 'Apotek K-24 & Toko Bangunan' }
    ],
    fotoDokumentasi: [
      { id: 'fd-1', url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80', caption: 'Rapat koordinasi panitia pematangan rute survival', tanggal: '2026-09-22' },
      { id: 'fd-2', url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&auto=format&fit=crop&q=80', caption: 'Pengecekan perlengkapan tenda dan logistik di Ruang OSIS', tanggal: '2026-10-02' }
    ],
    catatanTerbaru: 'Surat izin Kepala Madrasah telah disetujui. Tenda dan sound portabel telah dicek siap digunakan.',
    lastUpdated: '2026-10-04 11:30'
  },
  {
    id: 'proker-2',
    kode: 'PROKER-OSIS-02',
    nama: 'PORSENI & Milad Ke-15 Madrasah Al-Achdan',
    sekbid: 'Seksi Bidang 7 (Olahraga & Seni)',
    deskripsi: 'Pekan Olahraga dan Seni (PORSENI) serta perayaan Milad Ke-15 Madrasah Al-Achdan: kompetisi olahraga antar-kelas, festival kaligrafi & nasyid, bazar kewirausahaan siswa, serta pentas seni islami.',
    status: 'Disetujui',
    targetTanggal: '2026-11-25',
    progres: 45,
    anggaran: 12000000,
    terpakai: 2400000,
    picNama: 'Siti Aisyah Azzahra',
    picHp: '0813-8877-2211',
    milestones: [
      { id: 'm-201', judul: 'Penerbitan Surat Keputusan Panitia PORSENI & Milad', selesai: true, targetTanggal: '2026-09-15' },
      { id: 'm-202', judul: 'Penggalangan Dana Sponsor & Kemitraan', selesai: true, targetTanggal: '2026-09-30' },
      { id: 'm-203', judul: 'Penyewaan Panggung Utama & Sound System', selesai: false, targetTanggal: '2026-10-25' },
      { id: 'm-204', judul: 'Penyebaran Surat Undangan Sekolah & Alumni', selesai: false, targetTanggal: '2026-11-10' }
    ],
    fotoDokumentasi: [
      { id: 'fd-201', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80', caption: 'Audiensi bersama Kepala Madrasah Al-Achdan', tanggal: '2026-09-28' }
    ],
    catatanTerbaru: 'Mitra CV Mandiri telah menyepakati bantuan sponsorship senilai Rp 5.000.000.',
    lastUpdated: '2026-10-03 14:00'
  },
  {
    id: 'proker-3',
    kode: 'PROKER-OSIS-03',
    nama: 'Digitalisasi Administrasi & Tata Kelola OSIS',
    sekbid: 'Sekretariat Umum & Sekbid 9 (TIK)',
    deskripsi: 'Pengembangan platform sistem informasi administrasi digital OSIS oleh Nandi Achdarizal Sutisna untuk otomatisasi surat menyurat, kartu KTA siswa, kas keuangan, notulensi rapat, dan inventaris barang.',
    status: 'Sedang Berjalan',
    targetTanggal: '2026-10-30',
    progres: 95,
    anggaran: 1500000,
    terpakai: 850000,
    picNama: 'Nandi Achdarizal Sutisna',
    picHp: '0821-9988-7766',
    milestones: [
      { id: 'm-301', judul: 'Desain Antarmuka Portal Resmi OSIS & Dual Logo', selesai: true, targetTanggal: '2026-09-01' },
      { id: 'm-302', judul: 'Pemrograman Modul Cetak & Unduh PDF/DOC Kop A4', selesai: true, targetTanggal: '2026-09-18' },
      { id: 'm-303', judul: 'Penerbitan KTA Resmi Seluruh Pengurus OSIS', selesai: true, targetTanggal: '2026-09-29' },
      { id: 'm-304', judul: 'Peluncuran Kotak Aspirasi Siswa & Generator Piagam', selesai: true, targetTanggal: '2026-10-04' }
    ],
    fotoDokumentasi: [
      { id: 'fd-301', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80', caption: 'Uji coba operasional sistem di laboratorium komputer', tanggal: '2026-09-25' }
    ],
    catatanTerbaru: 'Sistem cetak dokumen kop resmi dan backup JSON berfungsi 100% lancar.',
    lastUpdated: '2026-10-04 10:15'
  }
];

export const INITIAL_SURAT: SuratItem[] = [
  {
    id: 'surat-1',
    nomorSurat: '042/OSIS-ACHDAN/IX/2026',
    jenis: 'Surat Keluar',
    klasifikasi: 'Permohonan Izin',
    perihal: 'Permohonan Izin Pelaksanaan Latihan Dasar Kepemimpinan Siswa (LDKS)',
    tujuanPengirim: 'Kepala Madrasah Al-Achdan',
    tanggal: '2026-09-12',
    statusDisposisi: 'Disetujui',
    ringkasan: 'Permohonan izin resmi pemakaian fasilitas madrasah dan dispensasi peserta LDKS.',
    fileLampiranNama: 'Proposal_LDKS_2026_Final.pdf',
    tempat: 'Aula Utama & Bumi Perkemahan Pinus Asri',
    waktu: 'Jumat - Ahad, 16 - 18 Oktober 2026',
    penandatanganNama: 'Muhammad Rayhan Al-Fatih (Ketua Umum OSIS) & Nandi Achdarizal Sutisna (Sekretaris Umum)',
    isiLengkap: `Dengan hormat, sehubungan dengan program kerja OSIS Madrasah Al-Achdan masa bakti 2026/2027, kami bermaksud menyelenggarakan Latihan Dasar Kepemimpinan Siswa (LDKS) bertajuk "Membentuk Generasi Berkarakter, Tangguh, dan Berintegritas Islami". Kegiatan ini akan diikuti oleh 65 calon pengurus baru.`
  },
  {
    id: 'surat-2',
    nomorSurat: '043/OSIS-ACHDAN/IX/2026',
    jenis: 'Surat Keluar',
    klasifikasi: 'Undangan',
    perihal: 'Undangan Rapat Pleno Koordinasi Persiapan Milad Ke-15 & PORSENI',
    tujuanPengirim: 'Seluruh Ketua Sekbid & Anggota MPK Madrasah Al-Achdan',
    tanggal: '2026-09-25',
    statusDisposisi: 'Diarsipkan',
    ringkasan: 'Undangan rapat koordinasi seksi acara, pendanaan, dan logistik perhelatan milad.',
    tempat: 'Ruang Rapat OSIS Lt. 2 Madrasah Al-Achdan',
    waktu: 'Sabtu, 26 September 2026 | Pukul 13.00 - 15.30 WIB',
    penandatanganNama: 'Muhammad Rayhan Al-Fatih (Ketua Umum OSIS) & Nandi Achdarizal Sutisna (Sekretaris Umum)',
    isiLengkap: `Assalamu'alaikum Wr. Wb. Mengharapkan kehadiran seluruh jajaran pengurus harian dan koordinator seksi bidang dalam rangka evaluasi progres sponsorship dan finalisasi rundown perayaan Milad Madrasah Al-Achdan ke-15.`
  }
];

export const INITIAL_INVENTARIS: InventarisItem[] = [
  {
    id: 'inv-1',
    kodeBarang: 'INV-ACHDAN-EL01',
    namaBarang: 'Sound System Portable Baretone 15 Inch + 2 Mic Wireless',
    kategori: 'Elektronik & Sound',
    jumlahTotal: 2,
    jumlahTersedia: 1,
    kondisi: 'Baik',
    lokasiPenyimpanan: 'Ruang Sekretariat OSIS (Rak A1)',
    fotoUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80',
    riwayatPinjam: [
      {
        id: 'pinjam-1',
        namaPeminjam: 'Ustadzah Halimah',
        kontak: '0812-9988-1122',
        instansiKelas: 'Ekskul Hadroh & Nasyid',
        jumlah: 1,
        tanggalPinjam: '2026-10-02',
        tenggatKembali: '2026-10-05',
        status: 'Sedang Dipinjam',
        keperluan: 'Latihan persiapan lomba nasyid AKSIOMA',
        petugasOsis: 'Dimas Bagas Pratama'
      }
    ],
    keterangan: 'Baterai rechargeable tahan 6 jam. Kabel charger tersimpan dalam tas pelindung.'
  },
  {
    id: 'inv-2',
    kodeBarang: 'INV-ACHDAN-EL02',
    namaBarang: 'Proyektor Epson EB-E01 3300 Lumens HDMI',
    kategori: 'Elektronik & Sound',
    jumlahTotal: 1,
    jumlahTersedia: 1,
    kondisi: 'Baik',
    lokasiPenyimpanan: 'Lemari Multimedia OSIS',
    fotoUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&auto=format&fit=crop&q=80',
    riwayatPinjam: [],
    keterangan: 'Lengkap dengan tas, kabel HDMI 10 meter, remote kontrol, dan pointer presentasi.'
  },
  {
    id: 'inv-3',
    kodeBarang: 'INV-ACHDAN-MD01',
    namaBarang: 'Kamera Mirrorless Canon EOS M50 Mark II + Lensa Kit 15-45mm',
    kategori: 'Dokumentasi & Media',
    jumlahTotal: 1,
    jumlahTersedia: 1,
    kondisi: 'Baik',
    lokasiPenyimpanan: 'Dry Box Multimedia OSIS',
    fotoUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
    riwayatPinjam: [],
    keterangan: 'Termasuk 2 baterai original, charger, memory card Sandisk Extreme 64GB, dan tripod Weifeng.'
  },
  {
    id: 'inv-4',
    kodeBarang: 'INV-ACHDAN-AC01',
    namaBarang: 'Tenda Dome Kapasitas 6 Orang (Double Layer Eiger)',
    kategori: 'Peralatan Acara',
    jumlahTotal: 6,
    jumlahTersedia: 6,
    kondisi: 'Baik',
    lokasiPenyimpanan: 'Gudang Sarpras Madrasah',
    fotoUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500&auto=format&fit=crop&q=80',
    riwayatPinjam: [],
    keterangan: 'Dipakai khusus kemah LDKS dan Pramuka. Dilengkapi frame fiber cadangan dan pasak baja.'
  }
];

export const INITIAL_KAS: KasTransaksi[] = [
  {
    id: 'kas-1',
    nomorKwitansi: 'KW/ACHDAN/2026/001',
    tanggal: '2026-08-20',
    jenis: 'Pemasukan',
    kategori: 'Dana Madrasah',
    nominal: 5000000,
    keterangan: 'Pencairan dana pembinaan OSIS Tahap 1 dari Komite & Madrasah Al-Achdan',
    pic: 'Fatimah Az-Zuhra',
    createdBy: 'Bendahara Umum OSIS'
  },
  {
    id: 'kas-2',
    nomorKwitansi: 'KW/ACHDAN/2026/002',
    tanggal: '2026-08-25',
    jenis: 'Pemasukan',
    kategori: 'Iuran Pengurus',
    nominal: 700000,
    keterangan: 'Iuran kas wajib bulanan seluruh pengurus OSIS periode Agustus',
    pic: 'Fatimah Az-Zuhra',
    createdBy: 'Bendahara Umum OSIS'
  },
  {
    id: 'kas-3',
    nomorKwitansi: 'KW/ACHDAN/2026/003',
    tanggal: '2026-09-02',
    jenis: 'Pengeluaran',
    kategori: 'Administrasi & Cetak',
    nominal: 350000,
    keterangan: 'Pembelian kertas HVS F4, tinta printer, laminasi dan cetak kartu KTA OSIS',
    pic: 'Nandi Achdarizal Sutisna',
    createdBy: 'Sekretaris Umum'
  },
  {
    id: 'kas-4',
    nomorKwitansi: 'KW/ACHDAN/2026/004',
    tanggal: '2026-09-15',
    jenis: 'Pengeluaran',
    kategori: 'Operasional & Konsumsi',
    nominal: 280000,
    keterangan: 'Snack rapat pleno pengurus pembahasan rancangan kalender kerja tahunan',
    pic: 'Fatimah Az-Zuhra',
    createdBy: 'Bendahara Umum OSIS'
  }
];

export const INITIAL_NOTULENSI: NotulensiRapat[] = [
  {
    id: 'notul-1',
    nomorNotulen: 'NOT/OSIS-ACHDAN/IX/01',
    judulRapat: 'Rapat Kerja Pleno Penetapan Program Kerja & Kalender OSIS 2026/2027',
    tanggal: '2026-09-05',
    waktu: '09.00 - 12.30 WIB',
    tempat: 'Aula Pertemuan Madrasah Al-Achdan',
    pemimpinRapat: 'Muhammad Rayhan Al-Fatih (Ketua Umum OSIS)',
    notulis: 'Nandi Achdarizal Sutisna (Sekretaris Umum)',
    agenda: '1. Pengesahan Struktur Pengurus & Pembagian Sekbid\n2. Pemaparan Timeline 1 Tahun Masa Jabatan\n3. Pembahasan Proker Unggulan: LDKS & Milad 15\n4. Ketentuan Presensi & Pencetakan KTA OSIS',
    pembahasan: 'Seluruh seksi bidang menyepakati alokasi anggaran proporsional. Sekretaris memperkenalkan platform administrasi digital untuk persuratan, inventaris, kas, dan presensi secara terpadu.',
    hasilKeputusan: [
      'Pelaksanaan LDKS 2026 disepakati tanggal 16-18 Oktober 2026.',
      'Target kemitraan sponsorship Milad Ke-15 minimal Rp 8.000.000 diampu oleh Sekbid 9 (Humas).',
      'Pencatatan presensi rapat OSIS menggunakan presensi digital terpadu.',
      'Peminjaman sarana inventaris wajib melalui koordinasi Sekbid 6 (Sarpras) dan tercatat dalam sistem.'
    ],
    tindakLanjut: 'Sekretaris mencetak dokumen keputusan dan mendistribusikan KTA resmi ke seluruh pengurus.',
    presensi: [
      { id: 'pres-1', pengurusId: 'p-1', nama: 'Muhammad Rayhan Al-Fatih', jabatan: 'Ketua Umum OSIS', status: 'Hadir' },
      { id: 'pres-2', pengurusId: 'p-2', nama: 'Siti Aisyah Azzahra', jabatan: 'Wakil Ketua OSIS', status: 'Hadir' },
      { id: 'pres-3', pengurusId: 'p-3', nama: 'Nandi Achdarizal Sutisna', jabatan: 'Sekretaris Umum', status: 'Hadir' },
      { id: 'pres-4', pengurusId: 'p-4', nama: 'Fatimah Az-Zuhra', jabatan: 'Bendahara Umum', status: 'Hadir' },
      { id: 'pres-5', pengurusId: 'p-5', nama: 'Dimas Bagas Pratama', jabatan: 'Koord. Sarpras', status: 'Hadir' },
      { id: 'pres-6', pengurusId: 'p-6', nama: 'Syifa Nurul Ilmi', jabatan: 'Koord. Humas', status: 'Hadir' },
      { id: 'pres-7', pengurusId: 'p-7', nama: 'Zikri Maulana Hakim', jabatan: 'Koord. Disiplin', status: 'Hadir' }
    ],
    status: 'Final'
  }
];

export const INITIAL_BERKAS: BerkasDrive[] = [
  {
    id: 'doc-1',
    namaFile: 'Proposal_LDKS_Madrasah_AlAchdan_2026.pdf',
    kategori: 'Proposal',
    ukuran: '2.4 MB',
    tipe: 'application/pdf',
    tanggalUnggah: '2026-09-10',
    dataUrl: '#',
    pengunggah: 'Nandi Achdarizal Sutisna',
    keterangan: 'Proposal lengkap dengan rincian biaya, jadwal kegiatan, dan surat persetujuan madrasah.'
  },
  {
    id: 'doc-2',
    namaFile: 'Pedoman_Administrasi_OSIS_AlAchdan.docx',
    kategori: 'Template',
    ukuran: '850 KB',
    tipe: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    tanggalUnggah: '2026-08-22',
    dataUrl: '#',
    pengunggah: 'Nandi Achdarizal Sutisna',
    keterangan: 'Buku panduan tata naskah dinas, klasifikasi surat, dan format berita acara resmi.'
  }
];

export const INITIAL_ASPIRASI: AspirasiSiswa[] = [
  {
    id: 'asp-1',
    namaPengirim: 'Siswa X-2',
    kelas: 'X-2',
    tanggal: '2026-09-28',
    kategori: 'Fasilitas & Sarpras',
    judul: 'Penambahan Stopkontak di Ruang Baca Perpustakaan',
    isiAspirasi: 'Mohon izin kepada Dewan Pengurus OSIS agar mengusulkan penambahan colokan listrik di meja perpustakaan untuk mendukung siswa yang mengerjakan tugas laptop.',
    status: 'Direalisasikan',
    tanggapanDewan: 'Usulan telah diteruskan ke Urusan Sarpras Madrasah dan telah dipasang 4 unit terminal listrik tambahan.',
    upvotes: 24
  },
  {
    id: 'asp-2',
    namaPengirim: 'Ahmad Fauzi',
    kelas: 'XI MIPA 2',
    tanggal: '2026-10-01',
    kategori: 'Kegiatan OSIS',
    judul: 'Adakan Turnamen E-Sport Madrasah pada Classmeeting',
    isiAspirasi: 'Bolehkah pada classmeeting nanti diadakan cabang Mobile Legends atau Catur Cepat antar-kelas untuk variasi selain futsal?',
    status: 'Diproses',
    tanggapanDewan: 'Sedang dikaji dalam rancangan rundown Milad 15 dan Classmeeting oleh Sekbid 7.',
    upvotes: 38
  },
  {
    id: 'asp-3',
    namaPengirim: 'Siti Nurhaliza',
    kelas: 'XI IPS 1',
    tanggal: '2026-10-03',
    kategori: 'Kantin & Lingkungan',
    judul: 'Gerakan Madrasah Bebas Sampah Plastik & Tempat Sampah Pilah',
    isiAspirasi: 'Sangat diharapkan OSIS mengkampanyekan bawa tumbler sendiri dan menyediakan dispenser isi ulang di koridor kelas.',
    status: 'Menunggu Dewan',
    tanggapanDewan: 'Akan diagendakan dalam Sidang Dewan Pleno Triwulan II.',
    upvotes: 19
  }
];

export const INITIAL_SERTIFIKAT: SertifikatItem[] = [
  {
    id: 'sert-1',
    nomorSertifikat: '089/SERT-ACHDAN/IX/2026',
    namaPenerima: 'Muhammad Rayhan Al-Fatih',
    nisn: '0078129340',
    kelas: 'XI MIPA 1',
    peranSebagai: 'Pengurus Berdedikasi',
    namaKegiatan: 'Masa Taaruf Siswa Madrasah (MATSAMA) & Pelantikan 2026',
    tanggalTerbit: '2026-09-01',
    deskripsiPrestasi: 'Atas dedikasi luar biasa, keteladanan moral, dan kepemimpinan visioner dalam menyukseskan rangkaian kaderisasi siswa baru Madrasah Al-Achdan.',
    penandatangan1: 'Drs. H. Ahmad Farhan, M.Pd.',
    penandatangan2: 'Muhammad Rayhan Al-Fatih'
  },
  {
    id: 'sert-2',
    nomorSertifikat: '090/SERT-ACHDAN/IX/2026',
    namaPenerima: 'Nandi Achdarizal Sutisna',
    nisn: '0078345911',
    kelas: 'XI MIPA 2',
    peranSebagai: 'Pengurus Berdedikasi',
    namaKegiatan: 'Arsitektur Sistem Manajemen Digital Terpadu Madrasah Al-Achdan',
    tanggalTerbit: '2026-09-15',
    deskripsiPrestasi: 'Atas karya inovasi digital dan kontribusi arsitektur teknologi administrasi OSIS Madrasah Al-Achdan.',
    penandatangan1: 'Drs. H. Ahmad Farhan, M.Pd.',
    penandatangan2: 'Muhammad Rayhan Al-Fatih'
  }
];
