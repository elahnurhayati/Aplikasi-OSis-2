import React from 'react';
import { Printer, Download, X, FileText, CheckCircle2, Shield, Globe } from 'lucide-react';
import { PengaturanMadrasah } from '../types';
import { downloadDocFile, downloadStandaloneHtml, printCleanHtml } from '../utils/exportUtils';
import madrasahLogoDefault from '../assets/images/madrasah_logo_1791115779583.jpg';
import osisLogoDefault from '../assets/images/osis_logo_1791115792715.jpg';

export interface DocumentData {
  title: string;
  nomorSurat?: string;
  tanggal?: string;
  lampiran?: string;
  perihal?: string;
  tujuan?: string;
  contentHtml: string;
  tandaTangan?: {
    kiri?: { jabatan: string; nama: string; nip?: string };
    kanan?: { jabatan: string; nama: string; nip?: string };
    tengah?: { jabatan: string; nama: string; nip?: string };
  };
}

interface DocumentPrintModalProps {
  document: DocumentData | null;
  madrasahInfo: PengaturanMadrasah;
  onClose: () => void;
}

export const DocumentPrintModal: React.FC<DocumentPrintModalProps> = ({ 
  document, 
  madrasahInfo,
  onClose 
}) => {
  if (!document) return null;

  const logoMadrasah = madrasahInfo.logoMadrasahUrl || madrasahLogoDefault;
  const logoOsis = madrasahInfo.logoOsisUrl || osisLogoDefault;

  // Build the complete, clean A4 HTML representation for print and download
  const generateCompleteDocumentHtml = () => {
    return `
      <div style="font-family: 'Times New Roman', Times, serif; font-size: 11.5pt; line-height: 1.5; color: #000; background: #ffffff;">
        <!-- KOP SURAT RESMI STANDAR MADRASAH & OSIS -->
        <table style="width: 100%; border-bottom: 3px double #000000; padding-bottom: 6pt; margin-bottom: 12pt; border-collapse: collapse;">
          <tr>
            <td style="width: 75px; vertical-align: middle; text-align: center; border: none !important;">
              <img src="${logoMadrasah}" style="width: 68px; height: 68px; border-radius: 50%; object-fit: contain;" />
            </td>
            <td style="text-align: center; border: none !important; padding: 0 10px;">
              <div style="font-size: 11pt; font-weight: bold; text-transform: uppercase; font-family: Arial, sans-serif; letter-spacing: 0.5px;">
                KEMENTERIAN AGAMA REPUBLIK INDONESIA
              </div>
              <div style="font-size: 10pt; font-weight: bold; text-transform: uppercase; color: #333; font-family: Arial, sans-serif;">
                ${madrasahInfo.yayasan}
              </div>
              <div style="font-size: 13.5pt; font-weight: 800; text-transform: uppercase; color: #111; font-family: Arial, sans-serif; margin: 2px 0;">
                ${madrasahInfo.nama}
              </div>
              <div style="font-size: 10.5pt; font-weight: bold; font-family: Arial, sans-serif; color: #1e3a8a;">
                ORGANISASI SISWA INTRA SEKOLAH (OSIS)
              </div>
              <div style="font-size: 8.5pt; color: #333; font-family: Arial, sans-serif; margin-top: 2px;">
                ${madrasahInfo.alamat} | Telp: ${madrasahInfo.telepon}
              </div>
              <div style="font-size: 8.5pt; color: #333; font-family: Arial, sans-serif;">
                Email: ${madrasahInfo.email} | NPSN: ${madrasahInfo.npsn}
              </div>
            </td>
            <td style="width: 75px; vertical-align: middle; text-align: center; border: none !important;">
              <img src="${logoOsis}" style="width: 68px; height: 68px; border-radius: 50%; object-fit: contain;" />
            </td>
          </tr>
        </table>

        <!-- METADATA SURAT JIKA ADA -->
        ${document.nomorSurat ? `
          <table style="width: 100%; margin-bottom: 14pt; border-collapse: collapse;">
            <tr>
              <td style="width: 60%; border: none !important; font-size: 11pt;">
                <div><strong>Nomor :</strong> ${document.nomorSurat}</div>
                <div><strong>Lamp :</strong> ${document.lampiran || '-'}</div>
                <div><strong>Perihal :</strong> <u>${document.perihal || document.title}</u></div>
              </td>
              <td style="width: 40%; text-align: right; vertical-align: top; border: none !important; font-size: 11pt;">
                <div>Jawa Barat, ${document.tanggal || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </td>
            </tr>
          </table>
        ` : ''}

        ${document.tujuan ? `
          <div style="margin-bottom: 14pt; font-size: 11pt;">
            <div>Kepada Yth.</div>
            <div><strong>${document.tujuan}</strong></div>
            <div>di Tempat</div>
          </div>
        ` : ''}

        <!-- JUDUL DOKUMEN JIKA BUKAN SURAT BIASA -->
        ${!document.nomorSurat ? `
          <div style="text-align: center; margin-bottom: 18pt;">
            <h2 style="font-size: 14pt; font-weight: bold; text-transform: uppercase; text-decoration: underline; margin-bottom: 4pt; font-family: Arial, sans-serif;">
              ${document.title}
            </h2>
            ${document.tanggal ? `<div style="font-size: 10pt; color: #444;">Per Tanggal: ${document.tanggal}</div>` : ''}
          </div>
        ` : ''}

        <!-- ISI KONTEN DOKUMEN -->
        <div style="margin-top: 10pt; margin-bottom: 25pt; text-align: justify; line-height: 1.6;">
          ${document.contentHtml}
        </div>

        <!-- TANDA TANGAN RESMI -->
        <table style="width: 100%; margin-top: 25pt; border-collapse: collapse; page-break-inside: avoid;">
          <tr>
            <td style="width: 50%; text-align: center; border: none !important; vertical-align: top;">
              <div>Mengetahui,</div>
              <div style="font-weight: bold;">${document.tandaTangan?.kiri?.jabatan || 'Ketua Umum OSIS'}</div>
              <div style="height: 55px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 8pt; color: #999; font-family: monospace;">[ TERTANDATANGAN ]</span>
              </div>
              <div style="font-weight: bold; text-decoration: underline;">${document.tandaTangan?.kiri?.nama || madrasahInfo.ketuaOsis}</div>
              <div style="font-size: 9pt; color: #444;">NISN: 0078129340</div>
            </td>
            <td style="width: 50%; text-align: center; border: none !important; vertical-align: top;">
              <div>Ditetapkan Oleh,</div>
              <div style="font-weight: bold;">${document.tandaTangan?.kanan?.jabatan || 'Sekretaris Umum OSIS'}</div>
              <div style="height: 55px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 8pt; color: #999; font-family: monospace;">[ TERTANDATANGAN ]</span>
              </div>
              <div style="font-weight: bold; text-decoration: underline;">${document.tandaTangan?.kanan?.nama || madrasahInfo.creator}</div>
              <div style="font-size: 9pt; color: #444;">NISN: 0078345911</div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: center; padding-top: 20pt; border: none !important;">
              <div>Mengesahkan / Menyetujui,</div>
              <div style="font-weight: bold;">Kepala ${madrasahInfo.nama}</div>
              <div style="height: 55px; display: flex; align-items: center; justify-content: center;">
                <div style="border: 1px solid #444; border-radius: 4px; padding: 2px 8px; font-size: 8pt; font-family: monospace; display: inline-block;">
                  TERVERIFIKASI & TERCATAT RESMI
                </div>
              </div>
              <div style="font-weight: bold; text-decoration: underline;">${madrasahInfo.kepalaMadrasah}</div>
              <div style="font-size: 9pt; color: #444;">NIP: ${madrasahInfo.nipKepala}</div>
            </td>
          </tr>
        </table>

        <!-- FOOTER RESMI -->
        <div style="margin-top: 30pt; border-top: 1px dashed #aaa; padding-top: 6pt; font-size: 7.5pt; color: #666; text-align: center; font-family: Arial, sans-serif;">
          Dokumen resmi diterbitkan melalui Sistem Administrasi Digital OSIS ${madrasahInfo.nama}. Dikembangkan oleh ${madrasahInfo.creator}.
        </div>
      </div>
    `;
  };

  const handlePrint = () => {
    const html = generateCompleteDocumentHtml();
    printCleanHtml(html, document.title);
  };

  const handleDownloadDoc = () => {
    const filename = `${document.title.replace(/[^a-zA-Z0-9]/g, '_')}_AlAchdan.doc`;
    const html = generateCompleteDocumentHtml();
    downloadDocFile(filename, html, document.title);
  };

  const handleDownloadHtml = () => {
    const filename = `${document.title.replace(/[^a-zA-Z0-9]/g, '_')}_AlAchdan.html`;
    const html = generateCompleteDocumentHtml();
    downloadStandaloneHtml(filename, html, document.title);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col my-auto max-h-[94vh]">
        
        {/* Header Modal Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0b1120] rounded-t-2xl flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                PREVIEW CETAK & UNDUH DOKUMEN RESMI OSIS
              </h3>
              <p className="text-xs text-slate-400">
                Format Standar A4 Resmi • {madrasahInfo.nama}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrint}
              title="Cetak Langsung atau Simpan sebagai PDF"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={handleDownloadDoc}
              title="Unduh File Microsoft Word .DOC"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] text-blue-300 border border-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Word (.DOC)</span>
            </button>

            <button
              onClick={handleDownloadHtml}
              title="Unduh File Web/PDF Mandiri (.HTML)"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] text-slate-200 border border-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>File (.HTML)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Document Preview (Clean White A4 Look) */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-[#070b14] flex justify-center">
          <div 
            id="printable-paper"
            className="w-full max-w-2xl bg-white text-slate-900 p-8 sm:p-12 shadow-2xl rounded-sm font-serif leading-relaxed border border-slate-300"
          >
            {/* Kop Surat Header with Dual Logos */}
            <div className="border-b-[3px] border-double border-slate-900 pb-3 mb-5 flex items-center justify-between gap-4 text-center">
              <img 
                src={logoMadrasah} 
                alt="Logo Madrasah" 
                className="w-16 h-16 object-cover rounded-full border border-slate-300 shrink-0"
              />
              <div className="flex-1 font-sans">
                <div className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
                  KEMENTERIAN AGAMA REPUBLIK INDONESIA
                </div>
                <div className="text-[10px] font-semibold text-slate-600 uppercase">
                  {madrasahInfo.yayasan}
                </div>
                <div className="text-base sm:text-lg font-extrabold text-[#111] uppercase tracking-wide my-0.5">
                  {madrasahInfo.nama}
                </div>
                <div className="text-xs font-bold text-blue-900 uppercase">
                  ORGANISASI SISWA INTRA SEKOLAH (OSIS)
                </div>
                <div className="text-[10px] text-slate-600 mt-0.5">
                  {madrasahInfo.alamat} | Telp: {madrasahInfo.telepon}
                </div>
                <div className="text-[10px] text-slate-600">
                  Email: {madrasahInfo.email} | NPSN: {madrasahInfo.npsn}
                </div>
              </div>
              <img 
                src={logoOsis} 
                alt="Logo OSIS" 
                className="w-16 h-16 object-cover rounded-full border border-slate-300 shrink-0"
              />
            </div>

            {/* Nomor dan Tanggal */}
            {document.nomorSurat && (
              <div className="flex justify-between text-xs mb-4 font-sans">
                <div>
                  <div><span className="font-semibold">Nomor :</span> {document.nomorSurat}</div>
                  <div><span className="font-semibold">Lampiran :</span> {document.lampiran || '-'}</div>
                  <div><span className="font-semibold">Perihal :</span> <span className="font-semibold underline">{document.perihal || document.title}</span></div>
                </div>
                <div className="text-right">
                  <div>Jawa Barat, {document.tanggal || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              </div>
            )}

            {document.tujuan && (
              <div className="text-xs mb-4 font-sans">
                <div>Kepada Yth.</div>
                <div className="font-semibold text-slate-900">{document.tujuan}</div>
                <div>di Tempat</div>
              </div>
            )}

            {!document.nomorSurat && (
              <div className="text-center mb-5 font-sans">
                <h2 className="text-base sm:text-lg font-bold uppercase underline tracking-wide">
                  {document.title}
                </h2>
                {document.tanggal && (
                  <p className="text-xs text-slate-600 mt-0.5">Tanggal: {document.tanggal}</p>
                )}
              </div>
            )}

            {/* Document Dynamic Content */}
            <div 
              className="text-xs sm:text-sm text-justify leading-relaxed font-serif space-y-3 print-content"
              dangerouslySetInnerHTML={{ __html: document.contentHtml }}
            />

            {/* Official Signatures */}
            <div className="mt-8 pt-4 font-sans text-xs">
              <div className="grid grid-cols-2 text-center gap-4">
                <div>
                  <div className="text-slate-600">Mengetahui,</div>
                  <div className="font-bold text-slate-900">{document.tandaTangan?.kiri?.jabatan || 'Ketua Umum OSIS'}</div>
                  <div className="h-14 flex items-center justify-center">
                    <span className="text-[10px] text-slate-400 font-mono tracking-widest">[ TERTANDATANGAN ]</span>
                  </div>
                  <div className="font-bold underline text-slate-900">{document.tandaTangan?.kiri?.nama || madrasahInfo.ketuaOsis}</div>
                  <div className="text-[11px] text-slate-600">NISN: 0078129340</div>
                </div>

                <div>
                  <div className="text-slate-600">Ditetapkan Oleh,</div>
                  <div className="font-bold text-slate-900">{document.tandaTangan?.kanan?.jabatan || 'Sekretaris Umum OSIS'}</div>
                  <div className="h-14 flex items-center justify-center">
                    <span className="text-[10px] text-slate-400 font-mono tracking-widest">[ TERTANDATANGAN ]</span>
                  </div>
                  <div className="font-bold underline text-slate-900">{document.tandaTangan?.kanan?.nama || madrasahInfo.creator}</div>
                  <div className="text-[11px] text-slate-600">NISN: 0078345911</div>
                </div>
              </div>

              <div className="text-center mt-6">
                <div className="text-slate-600">Mengesahkan / Menyetujui,</div>
                <div className="font-bold text-slate-900">Kepala {madrasahInfo.nama}</div>
                <div className="h-14 flex items-center justify-center">
                  <div className="border border-slate-700/50 rounded px-2.5 py-0.5 bg-slate-100 text-[10px] text-slate-800 font-mono">
                    SAH - TERVERIFIKASI MADRASAH
                  </div>
                </div>
                <div className="font-bold underline text-slate-900">{madrasahInfo.kepalaMadrasah}</div>
                <div className="text-[11px] text-slate-600">NIP: {madrasahInfo.nipKepala}</div>
              </div>
            </div>

            {/* Footer watermark */}
            <div className="mt-8 pt-2 border-t border-slate-200 text-[10px] text-slate-500 font-sans flex items-center justify-between">
              <span>Sistem Administrasi OSIS {madrasahInfo.nama}</span>
              <span>Dibuat oleh: {madrasahInfo.creator}</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#0b1120] flex items-center justify-between rounded-b-2xl">
          <div className="text-xs text-blue-400 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Format Siap Cetak A4 Standar Resmi Madrasah</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
