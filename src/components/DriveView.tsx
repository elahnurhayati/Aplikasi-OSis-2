import React, { useState } from 'react';
import { 
  HardDrive, 
  Upload, 
  Download, 
  FileText, 
  Trash2, 
  Search, 
  Filter, 
  Image as ImageIcon, 
  FileCheck, 
  Database,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { BerkasDrive } from '../types';
import { MADRASAH_INFO } from '../data/initialData';
import { fileToBase64 } from '../utils/exportUtils';

interface DriveViewProps {
  berkasList: BerkasDrive[];
  onAddBerkas: (berkas: BerkasDrive) => void;
  onDeleteBerkas: (id: string) => void;
  onBackupAll: () => void;
  onRestoreDefault: () => void;
}

export const DriveView: React.FC<DriveViewProps> = ({
  berkasList,
  onAddBerkas,
  onDeleteBerkas,
  onBackupAll,
  onRestoreDefault
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'Proposal' | 'LPJ' | 'Surat & SK' | 'Template' | 'Foto Kegiatan' | 'Arsip Lain'>('Proposal');
  const [fileDescription, setFileDescription] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const sizeFormatted = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      const newFile: BerkasDrive = {
        id: `file-${Date.now()}`,
        namaFile: file.name,
        kategori: selectedCategory,
        ukuran: sizeFormatted,
        tipe: file.type || 'application/octet-stream',
        tanggalUnggah: new Date().toISOString().split('T')[0],
        dataUrl: base64,
        pengunggah: MADRASAH_INFO.creator,
        keterangan: fileDescription || 'Diunggah melalui Arsip Digital OSIS Al-Achdan'
      };

      onAddBerkas(newFile);
      setFileDescription('');
      // Reset input
      e.target.value = '';
    } catch (err) {
      console.error('Error uploading file:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadFile = (file: BerkasDrive) => {
    if (file.dataUrl && file.dataUrl !== '#') {
      const link = document.createElement('a');
      link.href = file.dataUrl;
      link.download = file.namaFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For initial sample documents that have # url, trigger a synthetic sample document download
      const sampleBlob = new Blob([`Dokumen Resmi OSIS ${MADRASAH_INFO.nama}\nJudul: ${file.namaFile}\nKategori: ${file.kategori}\nPengunggah: ${file.pengunggah}`], { type: 'text/plain' });
      const url = URL.createObjectURL(sampleBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.namaFile.endsWith('.txt') ? file.namaFile : `${file.namaFile}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const filteredFiles = berkasList.filter(f => {
    const matchCat = categoryFilter === 'All' ? true : f.kategori === categoryFilter;
    const matchSearch = f.namaFile.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        f.keterangan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-blue-400" />
            ARSIP DIGITAL & BRANKAS BERKAS OSIS
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Penyimpanan terpusat dokumen proposal, LPJ, SK kepengurusan, template persuratan, dan dokumentasi kegiatan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackupAll}
            title="Download Cadangan Data Lengkap OSIS"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1e293b] hover:bg-[#334155] text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Backup Data JSON</span>
          </button>
        </div>
      </div>

      {/* Upload Box Component */}
      <div className="bg-[#0f172a] border-2 border-dashed border-blue-500/40 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">
                UNGGAH DOKUMEN / BERKAS BARU
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Format didukung: PDF, Word (.docx), Excel (.xlsx), Foto (.png/.jpg), arsip ZIP. Berkas tersimpan langsung dan dapat diunduh kapan saja tanpa batas waktu.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div>
                <label className="block text-[10px] font-mono text-blue-400 uppercase mb-1">
                  Kategori Berkas:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="bg-[#0b1120] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="Proposal">Proposal Kegiatan</option>
                  <option value="LPJ">Laporan Pertanggungjawaban (LPJ)</option>
                  <option value="Surat & SK">Surat & SK Pengurus</option>
                  <option value="Template">Template Administrasi</option>
                  <option value="Foto Kegiatan">Foto Dokumentasi</option>
                  <option value="Arsip Lain">Arsip Lainnya</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-mono text-blue-400 uppercase mb-1">
                  Keterangan Singkat:
                </label>
                <input
                  type="text"
                  placeholder="Deskripsi berkas..."
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                  className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-[#0b1120] border border-slate-800 rounded-xl shrink-0">
            <label className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="p-3 rounded-full bg-blue-950/60 border border-blue-500/40 text-blue-300 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-blue-300 group-hover:text-blue-200">
                {isUploading ? 'Sedang Memproses...' : 'Pilih Berkas Komputer'}
              </span>
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0f172a] p-4 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['All', 'Proposal', 'LPJ', 'Surat & SK', 'Template', 'Foto Kegiatan'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat === 'All' ? 'Semua Berkas' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama berkas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b1120] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Files List Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b1120] border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Dokumen / Berkas</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Ukuran</th>
                <th className="py-3 px-4">Pengunggah</th>
                <th className="py-3 px-4">Tanggal Unggah</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Belum ada berkas dalam kategori ini. Silakan unggah dokumen baru di atas.
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-[#1e293b] text-blue-400 shrink-0">
                          {file.kategori === 'Foto Kegiatan' ? (
                            <ImageIcon className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-white truncate">
                            {file.namaFile}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {file.keterangan}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-[#1e293b] text-blue-300 border border-slate-700">
                        {file.kategori}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {file.ukuran}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {file.pengunggah}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {file.tanggalUnggah}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleDownloadFile(file)}
                          title="Download Berkas Ini"
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh</span>
                        </button>

                        <button
                          onClick={() => onDeleteBerkas(file.id)}
                          title="Hapus Berkas"
                          className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg transition-colors cursor-pointer border border-red-800/40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
