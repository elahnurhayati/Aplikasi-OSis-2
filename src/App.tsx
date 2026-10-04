import React, { useState, useEffect } from 'react';
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
} from './types';
import { 
  getStoredPengurus, saveStoredPengurus,
  getStoredSurat, saveStoredSurat,
  getStoredProker, saveStoredProker,
  getStoredInventaris, saveStoredInventaris,
  getStoredKas, saveStoredKas,
  getStoredNotulensi, saveStoredNotulensi,
  getStoredBerkas, saveStoredBerkas,
  getStoredAspirasi, saveStoredAspirasi,
  getStoredSertifikat, saveStoredSertifikat,
  getStoredPengaturan, saveStoredPengaturan,
  resetAllDataToDefault
} from './utils/storage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SuratView } from './components/SuratView';
import { ProkerView } from './components/ProkerView';
import { InventarisView } from './components/InventarisView';
import { KasView } from './components/KasView';
import { PengurusView } from './components/PengurusView';
import { NotulensiView } from './components/NotulensiView';
import { DriveView } from './components/DriveView';
import { AspirasiView } from './components/AspirasiView';
import { SertifikatView } from './components/SertifikatView';
import { SettingsView } from './components/SettingsView';
import { DocumentPrintModal, DocumentData } from './components/DocumentPrintModal';
import { AboutModal } from './components/AboutModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Data State with Local Storage Persistence
  const [pengurus, setPengurus] = useState<Pengurus[]>(getStoredPengurus);
  const [surat, setSurat] = useState<SuratItem[]>(getStoredSurat);
  const [proker, setProker] = useState<Proker[]>(getStoredProker);
  const [inventaris, setInventaris] = useState<InventarisItem[]>(getStoredInventaris);
  const [kas, setKas] = useState<KasTransaksi[]>(getStoredKas);
  const [notulensi, setNotulensi] = useState<NotulensiRapat[]>(getStoredNotulensi);
  const [berkas, setBerkas] = useState<BerkasDrive[]>(getStoredBerkas);
  const [aspirasi, setAspirasi] = useState<AspirasiSiswa[]>(getStoredAspirasi);
  const [sertifikat, setSertifikat] = useState<SertifikatItem[]>(getStoredSertifikat);
  const [madrasahInfo, setMadrasahInfo] = useState<PengaturanMadrasah>(getStoredPengaturan);

  // Modals
  const [printDoc, setPrintDoc] = useState<DocumentData | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => { saveStoredPengurus(pengurus); }, [pengurus]);
  useEffect(() => { saveStoredSurat(surat); }, [surat]);
  useEffect(() => { saveStoredProker(proker); }, [proker]);
  useEffect(() => { saveStoredInventaris(inventaris); }, [inventaris]);
  useEffect(() => { saveStoredKas(kas); }, [kas]);
  useEffect(() => { saveStoredNotulensi(notulensi); }, [notulensi]);
  useEffect(() => { saveStoredBerkas(berkas); }, [berkas]);
  useEffect(() => { saveStoredAspirasi(aspirasi); }, [aspirasi]);
  useEffect(() => { saveStoredSertifikat(sertifikat); }, [sertifikat]);
  useEffect(() => { saveStoredPengaturan(madrasahInfo); }, [madrasahInfo]);

  // Handlers for Adding & Updating
  const handleAddSurat = (item: SuratItem) => {
    setSurat(prev => [item, ...prev]);
  };
  const handleUpdateSurat = (item: SuratItem) => {
    setSurat(prev => prev.map(s => s.id === item.id ? item : s));
  };

  const handleAddProker = (item: Proker) => {
    setProker(prev => [item, ...prev]);
  };
  const handleUpdateProker = (item: Proker) => {
    setProker(prev => prev.map(p => p.id === item.id ? item : p));
  };

  const handleAddInventaris = (item: InventarisItem) => {
    setInventaris(prev => [item, ...prev]);
  };
  const handleUpdateInventaris = (item: InventarisItem) => {
    setInventaris(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const handleAddKas = (item: KasTransaksi) => {
    setKas(prev => [item, ...prev]);
  };

  const handleAddPengurus = (item: Pengurus) => {
    setPengurus(prev => [...prev, item]);
  };
  const handleUpdatePengurus = (item: Pengurus) => {
    setPengurus(prev => prev.map(p => p.id === item.id ? item : p));
  };

  const handleAddNotulensi = (item: NotulensiRapat) => {
    setNotulensi(prev => [item, ...prev]);
  };

  const handleAddBerkas = (item: BerkasDrive) => {
    setBerkas(prev => [item, ...prev]);
  };
  const handleDeleteBerkas = (id: string) => {
    setBerkas(prev => prev.filter(b => b.id !== id));
  };

  const handleAddAspirasi = (item: AspirasiSiswa) => {
    setAspirasi(prev => [item, ...prev]);
  };
  const handleUpdateAspirasi = (item: AspirasiSiswa) => {
    setAspirasi(prev => prev.map(a => a.id === item.id ? item : a));
  };

  const handleAddSertifikat = (item: SertifikatItem) => {
    setSertifikat(prev => [item, ...prev]);
  };

  // Full backup JSON export
  const handleBackupAll = () => {
    const backupData = {
      version: '2.0-osis',
      exportDate: new Date().toISOString(),
      madrasah: madrasahInfo,
      pengurus,
      surat,
      proker,
      inventaris,
      kas,
      notulensi,
      berkas,
      aspirasi,
      sertifikat
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Backup_OSIS_AlAchdan_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Full backup JSON restore
  const handleRestoreJson = (jsonData: any) => {
    if (jsonData.madrasah) setMadrasahInfo(jsonData.madrasah);
    if (Array.isArray(jsonData.pengurus)) setPengurus(jsonData.pengurus);
    if (Array.isArray(jsonData.surat)) setSurat(jsonData.surat);
    if (Array.isArray(jsonData.proker)) setProker(jsonData.proker);
    if (Array.isArray(jsonData.inventaris)) setInventaris(jsonData.inventaris);
    if (Array.isArray(jsonData.kas)) setKas(jsonData.kas);
    if (Array.isArray(jsonData.notulensi)) setNotulensi(jsonData.notulensi);
    if (Array.isArray(jsonData.berkas)) setBerkas(jsonData.berkas);
    if (Array.isArray(jsonData.aspirasi)) setAspirasi(jsonData.aspirasi);
    if (Array.isArray(jsonData.sertifikat)) setSertifikat(jsonData.sertifikat);
  };

  const handleRestoreDefault = () => {
    resetAllDataToDefault();
    window.location.reload();
  };

  const handleQuickPrint = () => {
    window.print();
  };

  const totalCounts = {
    surat: surat.length,
    proker: proker.length,
    inventaris: inventaris.length,
    pengurus: pengurus.length,
    aspirasi: aspirasi.length,
    sertifikat: sertifikat.length,
    kas: kas.length,
    notulensi: notulensi.length,
    berkas: berkas.length
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-white">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onOpenAbout={() => setIsAboutOpen(true)}
        onQuickPrint={handleQuickPrint}
        onOpenSettings={() => setActiveTab('logos')}
        madrasahInfo={madrasahInfo}
      />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        
        {/* Sidebar Nav */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={totalCounts}
          madrasahInfo={madrasahInfo}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 p-3 sm:p-5 lg:p-7 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              pengurus={pengurus}
              proker={proker}
              inventaris={inventaris}
              kas={kas}
              surat={surat}
              aspirasi={aspirasi}
              madrasahInfo={madrasahInfo}
              setActiveTab={setActiveTab}
              onOpenQuickSurat={() => setActiveTab('surat')}
              onOpenQuickKas={() => setActiveTab('kas')}
            />
          )}

          {activeTab === 'surat' && (
            <SuratView
              suratList={surat}
              onAddSurat={handleAddSurat}
              onUpdateSurat={handleUpdateSurat}
              onPreviewPrint={(doc) => setPrintDoc(doc)}
              madrasahInfo={madrasahInfo}
            />
          )}

          {activeTab === 'proker' && (
            <ProkerView
              prokerList={proker}
              onUpdateProker={handleUpdateProker}
              onAddProker={handleAddProker}
              onPreviewPrint={(doc) => setPrintDoc(doc)}
              madrasahInfo={madrasahInfo}
            />
          )}

          {activeTab === 'inventaris' && (
            <InventarisView
              inventarisList={inventaris}
              onUpdateInventaris={handleUpdateInventaris}
              onAddInventaris={handleAddInventaris}
              onPreviewPrint={(doc) => setPrintDoc(doc)}
              madrasahInfo={madrasahInfo}
            />
          )}

          {activeTab === 'kas' && (
            <KasView
              kasList={kas}
              onAddKas={handleAddKas}
              onPreviewPrint={(doc) => setPrintDoc(doc)}
              madrasahInfo={madrasahInfo}
            />
          )}

          {activeTab === 'pengurus' && (
            <PengurusView
              pengurusList={pengurus}
              onAddPengurus={handleAddPengurus}
              onUpdatePengurus={handleUpdatePengurus}
              onPreviewPrint={(doc) => setPrintDoc(doc)}
              madrasahInfo={madrasahInfo}
            />
          )}

          {activeTab === 'notulensi' && (
            <NotulensiView
              notulensiList={notulensi}
              pengurusList={pengurus}
              onAddNotulensi={handleAddNotulensi}
              onPreviewPrint={(doc) => setPrintDoc(doc)}
              madrasahInfo={madrasahInfo}
            />
          )}

          {activeTab === 'aspirasi' && (
            <AspirasiView
              aspirasiList={aspirasi}
              onAddAspirasi={handleAddAspirasi}
              onUpdateAspirasi={handleUpdateAspirasi}
              onPreviewPrint={(doc) => setPrintDoc(doc)}
              madrasahInfo={madrasahInfo}
            />
          )}

          {activeTab === 'sertifikat' && (
            <SertifikatView
              sertifikatList={sertifikat}
              onAddSertifikat={handleAddSertifikat}
              onPreviewPrint={(doc) => setPrintDoc(doc)}
              madrasahInfo={madrasahInfo}
            />
          )}

          {activeTab === 'drive' && (
            <DriveView
              berkasList={berkas}
              onAddBerkas={handleAddBerkas}
              onDeleteBerkas={handleDeleteBerkas}
              onBackupAll={handleBackupAll}
              onRestoreDefault={handleRestoreDefault}
            />
          )}

          {(activeTab === 'settings' || activeTab === 'logos') && (
            <SettingsView
              madrasahInfo={madrasahInfo}
              onUpdateMadrasahInfo={setMadrasahInfo}
              onBackupJson={handleBackupAll}
              onRestoreJson={handleRestoreJson}
              onResetDefault={handleRestoreDefault}
              initialTab={activeTab === 'logos' ? 'logos' : 'profile'}
              counts={totalCounts}
            />
          )}
        </main>
      </div>

      {/* Universal Document Print & DOC Download Modal */}
      <DocumentPrintModal
        document={printDoc}
        madrasahInfo={madrasahInfo}
        onClose={() => setPrintDoc(null)}
      />

      {/* Creator & Madrasah Info Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        madrasahInfo={madrasahInfo}
      />
    </div>
  );
}
