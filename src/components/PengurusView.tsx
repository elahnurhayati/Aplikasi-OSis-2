import React, { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  Plus, 
  Printer, 
  RotateCw, 
  Search, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  X, 
  Upload, 
  School,
  Mail,
  Phone,
  QrCode
} from 'lucide-react';
import { Pengurus, PengaturanMadrasah } from '../types';
import { DocumentData } from './DocumentPrintModal';
import { fileToBase64 } from '../utils/exportUtils';
import madrasahLogoDefault from '../assets/images/madrasah_logo_1791115779583.jpg';
import osisLogoDefault from '../assets/images/osis_logo_1791115792715.jpg';

interface PengurusViewProps {
  pengurusList: Pengurus[];
  onAddPengurus: (pengurus: Pengurus) => void;
  onUpdatePengurus: (pengurus: Pengurus) => void;
  onPreviewPrint: (doc: DocumentData) => void;
  madrasahInfo: PengaturanMadrasah;
}

const JABATAN_OSIS_OPTIONS = [
  'Ketua Umum OSIS',
  'Wakil Ketua OSIS',
  'Sekretaris Umum',
  'Sekretaris I',
  'Bendahara Umum',
  'Bendahara I',
  'Koordinator Sekbid 1 (Ketaqwaan & Rohis)',
  'Koordinator Sekbid 2 (Kedisiplinan & Budi Pekerti)',
  'Koordinator Sekbid 3 (Kepemimpinan & Wawasan Kebangsaan)',
  'Koordinator Sekbid 4 (Prestasi Akademik & Iptek)',
  'Koordinator Sekbid 5 (Demokrasi & Pendidikan Politik)',
  'Koordinator Sekbid 6 (Kewirausahaan & Sarana)',
  'Koordinator Sekbid 7 (Jasmani & Olahraga)',
  'Koordinator Sekbid 8 (Apresiasi Seni & Budaya)',
  'Koordinator Sekbid 9 (TIK, Humas & Publikasi)',
  'Koordinator Sekbid 10 (Komunikasi Bahasa Asing)',
  'Anggota Sekbid'
];

export const PengurusView: React.FC<PengurusViewProps> = ({
  pengurusList,
  onAddPengurus,
  onUpdatePengurus,
  onPreviewPrint,
  madrasahInfo
}) => {
  const [selectedPengurus, setSelectedPengurus] = useState<Pengurus>(pengurusList[0] || null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const logoMadrasah = madrasahInfo.logoMadrasahUrl || madrasahLogoDefault;
  const logoOsis = madrasahInfo.logoOsisUrl || osisLogoDefault;

  // Form state
  const [formData, setFormData] = useState<Partial<Pengurus>>({
    nomorAnggota: `KTA-ACHDAN-00${pengurusList.length + 1}`,
    nama: '',
    nisn: '',
    kelas: 'X-1',
    jabatan: 'Koordinator Sekbid 1 (Ketaqwaan & Rohis)',
    sekbid: 'Seksi Bidang 1 (Ketaqwaan)',
    noHp: '0812-xxxx-xxxx',
    email: 'siswa@madrasah-alachdan.sch.id',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    status: 'Aktif',
    motto: 'Bekerja dengan ikhlas dan berakhlak mulia.',
    tanggalLantik: '2026-08-15'
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setFormData(prev => ({ ...prev, fotoUrl: base64 }));
    }
  };

  const handleSavePengurus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nisn) return;

    const newP: Pengurus = {
      id: `p-${Date.now()}`,
      nomorAnggota: formData.nomorAnggota || `KTA-ACHDAN-00${pengurusList.length + 1}`,
      nama: formData.nama,
      nisn: formData.nisn,
      kelas: formData.kelas || 'X-1',
      jabatan: formData.jabatan || 'Anggota Sekbid',
      sekbid: formData.sekbid || 'Badan Pengurus Harian (BPH)',
      noHp: formData.noHp || '',
      email: formData.email || '',
      fotoUrl: formData.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      status: 'Aktif',
      motto: formData.motto || '',
      tanggalLantik: formData.tanggalLantik || '2026-08-15'
    };

    onAddPengurus(newP);
    setSelectedPengurus(newP);
    setIsAddModalOpen(false);
  };

  // Print High-Fidelity KTA OSIS Card
  const handlePrintKTA = (p: Pengurus) => {
    const noKta = p.nomorAnggota || p.hunterId || `KTA-ACHDAN-${p.id}`;
    const ktaHtml = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; font-family: Arial, sans-serif; padding: 20px;">
        <div style="text-align: center;">
          <h3 style="margin-bottom: 2px; font-size: 13pt; font-weight: bold; text-transform: uppercase;">
            KARTU TANDA ANGGOTA RESMI (KTA) OSIS
          </h3>
          <p style="margin-top: 0; font-size: 10pt; color: #444;">
            ${madrasahInfo.nama} • ${madrasahInfo.periode}
          </p>
        </div>

        <!-- TAMPAK DEPAN KTA -->
        <div style="width: 480px; height: 290px; border-radius: 12px; border: 2.5px solid #1e3a8a; background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%); color: #0f172a; padding: 16px; box-sizing: border-box; position: relative; box-shadow: 0 4px 16px rgba(0,0,0,0.15);">
          <!-- Top Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 8px;">
            <img src="${logoMadrasah}" style="width: 45px; height: 45px; object-fit: contain; border-radius: 50%;" />
            <div style="text-align: center; flex: 1; padding: 0 8px;">
              <div style="font-size: 8.5pt; font-weight: bold; color: #333; text-transform: uppercase;">${madrasahInfo.yayasan}</div>
              <div style="font-size: 10.5pt; font-weight: 800; color: #1e3a8a; text-transform: uppercase;">${madrasahInfo.nama}</div>
              <div style="font-size: 8pt; font-weight: bold; color: #059669; letter-spacing: 1px;">KARTU TANDA ANGGOTA OSIS</div>
            </div>
            <img src="${logoOsis}" style="width: 45px; height: 45px; object-fit: contain; border-radius: 50%;" />
          </div>

          <!-- Body Card -->
          <div style="display: flex; gap: 14px; margin-top: 12px; align-items: center;">
            <!-- Foto Pengurus -->
            <div style="width: 105px; height: 135px; border: 2px solid #1e3a8a; border-radius: 6px; overflow: hidden; background: #fff; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
              <img src="${p.fotoUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>

            <!-- Details -->
            <div style="flex: 1; font-size: 9pt; line-height: 1.45;">
              <div style="font-size: 12pt; font-weight: bold; color: #0f172a;">${p.nama}</div>
              <div style="font-size: 9.5pt; color: #1e3a8a; font-weight: 700; margin-top: 1px;">${p.jabatan}</div>
              <div style="font-size: 8pt; color: #555; margin-top: 1px;">${p.sekbid}</div>

              <div style="margin-top: 8px; font-size: 8.5pt; font-family: monospace; color: #111; line-height: 1.5; background: #e0f2fe; padding: 4px 8px; border-radius: 4px; border-left: 3px solid #0284c7;">
                <div>NO KTA : <strong>${noKta}</strong></div>
                <div>NISN   : ${p.nisn}</div>
                <div>KELAS  : ${p.kelas}</div>
                <div>STATUS : <strong>${p.status}</strong></div>
              </div>
            </div>
          </div>

          <!-- Bottom Footer -->
          <div style="position: absolute; bottom: 8px; left: 16px; right: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 7.5pt; color: #555; border-top: 1px solid #cbd5e1; padding-top: 4px;">
            <span>${madrasahInfo.periode}</span>
            <span>VERIFIED IDENTITY • MADRASAH AL-ACHDAN</span>
          </div>
        </div>

        <!-- TAMPAK BELAKANG KTA -->
        <div style="width: 480px; height: 290px; border-radius: 12px; border: 2.5px solid #1e3a8a; background: #ffffff; color: #0f172a; padding: 16px; box-sizing: border-box; position: relative; box-shadow: 0 4px 16px rgba(0,0,0,0.15);">
          <!-- Header Belakang -->
          <div style="text-align: center; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 6px; font-size: 9pt; font-weight: bold; color: #1e3a8a;">
            KETENTUAN & TATA TERTIB PEMEGANG KTA OSIS
          </div>

          <div style="margin-top: 10px; font-size: 7.5pt; color: #334155; line-height: 1.5;">
            <div>1. Kartu Tanda Anggota (KTA) ini merupakan bukti sah keanggotaan kepengurusan OSIS ${madrasahInfo.nama}.</div>
            <div>2. Pemegang KTA berhak dan berkewajiban menjalankan amanah program kerja dengan penuh tanggung jawab.</div>
            <div>3. Wajib menjunjung tinggi akhlakul karimah, keteladanan, kedisiplinan, dan nama baik madrasah.</div>
            <div>4. KTA tidak dapat dipindahtangankan kepada orang lain. Apabila hilang, segera lapor ke Sekretariat OSIS.</div>
          </div>

          <div style="position: absolute; bottom: 12px; left: 20px; right: 20px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 7.5pt; color: #111;">
            <div style="text-align: center;">
              <div>Mengetahui,</div>
              <div>Kepala ${madrasahInfo.nama}</div>
              <div style="font-weight: bold; text-decoration: underline; margin-top: 30px;">${madrasahInfo.kepalaMadrasah}</div>
              <div style="font-size: 6.5pt; color: #555;">NIP: ${madrasahInfo.nipKepala}</div>
            </div>
            
            <div style="text-align: center;">
              <div style="width: 45px; height: 45px; border: 1px solid #1e3a8a; margin: 0 auto; padding: 2px; background: #f8fafc;">
                <div style="width: 100%; height: 100%; background: #0f172a; color: #fff; font-size: 6pt; display: flex; align-items: center; justify-content: center; font-family: monospace;">QR OSIS</div>
              </div>
              <div style="font-size: 6.5pt; font-family: monospace; color: #1e3a8a; margin-top: 2px;">RESMI</div>
            </div>

            <div style="text-align: center;">
              <div>Pembina OSIS,</div>
              <div style="font-weight: bold; text-decoration: underline; margin-top: 30px;">${madrasahInfo.pembinaOsis}</div>
              <div style="font-size: 6.5pt; color: #555;">NIP: ${madrasahInfo.nipPembina}</div>
            </div>
          </div>
        </div>

      </div>
    `;

    onPreviewPrint({
      title: `KTA OSIS - ${p.nama}`,
      tanggal: p.tanggalLantik,
      perihal: `Kartu Tanda Anggota ${noKta}`,
      contentHtml: ktaHtml
    });
  };

  const filteredPengurus = pengurusList.filter(p => {
    const term = searchQuery.toLowerCase();
    const noKta = (p.nomorAnggota || p.hunterId || '').toLowerCase();
    return (
      p.nama.toLowerCase().includes(term) ||
      p.jabatan.toLowerCase().includes(term) ||
      p.sekbid.toLowerCase().includes(term) ||
      noKta.includes(term)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Top Action Header */}
      <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            STRUKTUR PENGURUS & KARTU TANDA ANGGOTA (KTA) OSIS
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Data lengkap anggota Badan Pengurus Harian (BPH), Sekbid 1-10, dan generator KTA resmi siap cetak
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pengurus Baru</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Card Preview on Left, Member Directory on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: INTERACTIVE KTA CARD (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                Pratinjau KTA OSIS Resmi (Klik Balik)
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2.5 py-1 rounded bg-[#1e293b] border border-slate-700 cursor-pointer"
                >
                  <RotateCw className="w-3 h-3 text-blue-400" />
                  <span>{isFlipped ? 'Tampak Depan' : 'Tampak Belakang'}</span>
                </button>

                {selectedPengurus && (
                  <button
                    type="button"
                    onClick={() => handlePrintKTA(selectedPengurus)}
                    className="flex items-center gap-1 text-[11px] text-white px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 font-bold cursor-pointer"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Cetak KTA</span>
                  </button>
                )}
              </div>
            </div>

            {/* The KTA Card Component */}
            {selectedPengurus ? (
              <div className="perspective-1000 flex justify-center py-2">
                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full max-w-[420px] h-[255px] rounded-xl relative cursor-pointer select-none transition-transform duration-500 shadow-xl"
                  style={{
                    background: isFlipped 
                      ? '#ffffff' 
                      : 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
                    border: '2px solid #1e3a8a',
                    color: '#0f172a'
                  }}
                >
                  {!isFlipped ? (
                    /* TAMPAK DEPAN */
                    <div className="p-4 h-full flex flex-col justify-between">
                      {/* Top Bar with Dual Logos */}
                      <div className="flex items-center justify-between border-b border-blue-900 pb-2">
                        <img 
                          src={logoMadrasah} 
                          alt="Logo Madrasah" 
                          className="w-9 h-9 rounded-full object-cover border border-emerald-500 bg-white"
                        />
                        <div className="text-center flex-1 px-2">
                          <div className="text-[8px] font-bold uppercase text-slate-600 tracking-wider">
                            {madrasahInfo.yayasan}
                          </div>
                          <div className="text-[11px] font-extrabold uppercase text-blue-900">
                            {madrasahInfo.nama}
                          </div>
                          <div className="text-[8px] font-bold text-emerald-600 tracking-wide">
                            KARTU TANDA ANGGOTA OSIS
                          </div>
                        </div>
                        <img 
                          src={logoOsis} 
                          alt="Logo OSIS" 
                          className="w-9 h-9 rounded-full object-cover border border-amber-500 bg-white"
                        />
                      </div>

                      {/* Main Body */}
                      <div className="flex items-center gap-3 my-auto">
                        <img 
                          src={selectedPengurus.fotoUrl} 
                          alt={selectedPengurus.nama} 
                          className="w-20 h-24 object-cover rounded-md border-2 border-blue-800 shadow bg-white shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {selectedPengurus.nama}
                          </h4>
                          <div className="text-xs font-bold text-blue-700 truncate">
                            {selectedPengurus.jabatan}
                          </div>
                          <div className="text-[10px] text-slate-600 truncate">
                            {selectedPengurus.sekbid}
                          </div>

                          <div className="mt-2 text-[9px] font-mono bg-blue-50 p-1.5 rounded border border-blue-200 text-slate-800 space-y-0.5">
                            <div>KTA: <strong>{selectedPengurus.nomorAnggota || selectedPengurus.hunterId || 'KTA-001'}</strong></div>
                            <div>NISN: {selectedPengurus.nisn} • KELAS: {selectedPengurus.kelas}</div>
                            <div>STATUS: <span className="text-emerald-700 font-bold">{selectedPengurus.status}</span></div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Footer */}
                      <div className="flex items-center justify-between text-[8px] text-slate-500 border-t border-slate-200 pt-1">
                        <span>Masa Bakti: {madrasahInfo.periode}</span>
                        <span>Klik untuk balik kartu</span>
                      </div>
                    </div>
                  ) : (
                    /* TAMPAK BELAKANG */
                    <div className="p-4 h-full flex flex-col justify-between text-slate-800">
                      <div>
                        <div className="text-center font-bold text-xs text-blue-900 border-b border-slate-200 pb-1">
                          KETENTUAN ANGGOTA OSIS
                        </div>
                        <div className="text-[8px] text-slate-600 space-y-1 mt-2 leading-relaxed">
                          <div>1. KTA ini adalah bukti sah kepengurusan OSIS {madrasahInfo.nama}.</div>
                          <div>2. Pemegang kartu berkewajiban menjaga nama baik almamater madrasah.</div>
                          <div>3. Menjadi teladan akhlak, kedisiplinan, dan integritas bagi siswa lain.</div>
                          <div>4. Jika menemukan kartu ini, harap mengembalikan ke Ruang OSIS.</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-end text-[8px] pt-2 border-t border-slate-200">
                        <div className="text-center">
                          <div>Kepala Madrasah,</div>
                          <div className="font-bold underline mt-5">{madrasahInfo.kepalaMadrasah}</div>
                          <div className="text-[7px] text-slate-500">NIP: {madrasahInfo.nipKepala}</div>
                        </div>

                        <div className="text-center">
                          <QrCode className="w-8 h-8 text-blue-900 mx-auto" />
                          <div className="text-[7px] font-mono mt-0.5">TERVERIFIKASI</div>
                        </div>

                        <div className="text-center">
                          <div>Pembina OSIS,</div>
                          <div className="font-bold underline mt-5">{madrasahInfo.pembinaOsis}</div>
                          <div className="text-[7px] text-slate-500">NIP: {madrasahInfo.nipPembina}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">Pilih anggota untuk melihat KTA</div>
            )}

            {/* Member Profile Details Box */}
            {selectedPengurus && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Motto Kepengurusan:</span>
                  <span className="text-emerald-400 font-semibold">{selectedPengurus.status}</span>
                </div>
                <p className="text-slate-300 italic bg-[#1e293b] p-2.5 rounded-lg border border-slate-700/80">
                  "{selectedPengurus.motto}"
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  <div className="bg-[#1e293b] p-2 rounded-lg text-slate-300 flex items-center gap-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{selectedPengurus.noHp}</span>
                  </div>
                  <div className="bg-[#1e293b] p-2 rounded-lg text-slate-300 flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{selectedPengurus.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: MEMBER DIRECTORY (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
            
            {/* Search Bar */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama anggota, jabatan, sekbid, atau nomor KTA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="text-xs text-slate-400 font-mono shrink-0">
                {filteredPengurus.length} Pengurus
              </div>
            </div>

            {/* Member List */}
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredPengurus.map((p) => {
                const isSelected = selectedPengurus?.id === p.id;
                const noKta = p.nomorAnggota || p.hunterId || `KTA-${p.id}`;

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPengurus(p);
                      setIsFlipped(false);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500 shadow-sm'
                        : 'bg-[#1e293b]/60 border-slate-800 hover:border-slate-700 hover:bg-[#1e293b]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={p.fotoUrl} 
                        alt={p.nama} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-600 bg-white shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white truncate">{p.nama}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-blue-900/60 text-blue-300 rounded border border-blue-700">
                            {p.kelas}
                          </span>
                        </div>
                        <div className="text-[11px] text-blue-400 font-medium truncate">{p.jabatan}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">{noKta} • {p.sekbid}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrintKTA(p);
                        }}
                        title="Cetak KTA Anggota"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

      {/* Modal Tambah Pengurus Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  TAMBAH ANGGOTA PENGURUS OSIS
                </h3>
                <p className="text-xs text-slate-400">
                  Masukkan identitas lengkap pengurus untuk registrasi KTA resmi
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePengurus} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nama Lengkap Siswa
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ahmad Fauzan"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    NISN (Nomor Induk Siswa Nasional)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 0078129340"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kelas
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: XI MIPA 1"
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nomor KTA
                  </label>
                  <input
                    type="text"
                    value={formData.nomorAnggota}
                    onChange={(e) => setFormData({ ...formData, nomorAnggota: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Jabatan Pengurus OSIS
                </label>
                <select
                  value={formData.jabatan}
                  onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {JABATAN_OSIS_OPTIONS.map((jab) => (
                    <option key={jab} value={jab}>{jab}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Divisi / Sekbid Penugasan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Badan Pengurus Harian (BPH) / Sekbid 1 (Ketaqwaan)"
                  value={formData.sekbid}
                  onChange={(e) => setFormData({ ...formData, sekbid: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    No. Handphone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.noHp}
                    onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Siswa
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Unggah Foto Profil */}
              <div className="p-3 bg-[#1e293b] rounded-xl border border-slate-700 space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Foto Resmi Pengurus (Formal / Seragam):
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-xs text-slate-300 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Motto Amanah Jabatan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Menjadi teladan akhlak dan melayani sesama siswa."
                  value={formData.motto}
                  onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow cursor-pointer transition-colors"
                >
                  Simpan Pengurus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
