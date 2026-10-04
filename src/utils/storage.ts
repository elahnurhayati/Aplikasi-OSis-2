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
import { 
  INITIAL_PENGURUS, 
  INITIAL_SURAT, 
  INITIAL_PROKER, 
  INITIAL_INVENTARIS, 
  INITIAL_KAS, 
  INITIAL_NOTULENSI, 
  INITIAL_BERKAS,
  INITIAL_ASPIRASI,
  INITIAL_SERTIFIKAT,
  MADRASAH_INFO
} from '../data/initialData';

const STORAGE_KEYS = {
  PENGURUS: 'got_osis_pengurus_v2',
  SURAT: 'got_osis_surat_v2',
  PROKER: 'got_osis_proker_v2',
  INVENTARIS: 'got_osis_inventaris_v2',
  KAS: 'got_osis_kas_v2',
  NOTULENSI: 'got_osis_notulensi_v2',
  BERKAS: 'got_osis_berkas_v2',
  ASPIRASI: 'got_osis_aspirasi_v2',
  SERTIFIKAT: 'got_osis_sertifikat_v2',
  PENGATURAN: 'got_osis_pengaturan_v2'
};

export const getStoredPengurus = (): Pengurus[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PENGURUS);
    return data ? JSON.parse(data) : INITIAL_PENGURUS;
  } catch {
    return INITIAL_PENGURUS;
  }
};

export const saveStoredPengurus = (items: Pengurus[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PENGURUS, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving pengurus:', e);
  }
};

export const getStoredSurat = (): SuratItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SURAT);
    return data ? JSON.parse(data) : INITIAL_SURAT;
  } catch {
    return INITIAL_SURAT;
  }
};

export const saveStoredSurat = (items: SuratItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SURAT, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving surat:', e);
  }
};

export const getStoredProker = (): Proker[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROKER);
    return data ? JSON.parse(data) : INITIAL_PROKER;
  } catch {
    return INITIAL_PROKER;
  }
};

export const saveStoredProker = (items: Proker[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROKER, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving proker:', e);
  }
};

export const getStoredInventaris = (): InventarisItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INVENTARIS);
    return data ? JSON.parse(data) : INITIAL_INVENTARIS;
  } catch {
    return INITIAL_INVENTARIS;
  }
};

export const saveStoredInventaris = (items: InventarisItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.INVENTARIS, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving inventaris:', e);
  }
};

export const getStoredKas = (): KasTransaksi[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.KAS);
    return data ? JSON.parse(data) : INITIAL_KAS;
  } catch {
    return INITIAL_KAS;
  }
};

export const saveStoredKas = (items: KasTransaksi[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.KAS, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving kas:', e);
  }
};

export const getStoredNotulensi = (): NotulensiRapat[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTULENSI);
    return data ? JSON.parse(data) : INITIAL_NOTULENSI;
  } catch {
    return INITIAL_NOTULENSI;
  }
};

export const saveStoredNotulensi = (items: NotulensiRapat[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTULENSI, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving notulensi:', e);
  }
};

export const getStoredBerkas = (): BerkasDrive[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BERKAS);
    return data ? JSON.parse(data) : INITIAL_BERKAS;
  } catch {
    return INITIAL_BERKAS;
  }
};

export const saveStoredBerkas = (items: BerkasDrive[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BERKAS, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving berkas:', e);
  }
};

export const getStoredAspirasi = (): AspirasiSiswa[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ASPIRASI);
    return data ? JSON.parse(data) : INITIAL_ASPIRASI;
  } catch {
    return INITIAL_ASPIRASI;
  }
};

export const saveStoredAspirasi = (items: AspirasiSiswa[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ASPIRASI, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving aspirasi:', e);
  }
};

export const getStoredSertifikat = (): SertifikatItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SERTIFIKAT);
    return data ? JSON.parse(data) : INITIAL_SERTIFIKAT;
  } catch {
    return INITIAL_SERTIFIKAT;
  }
};

export const saveStoredSertifikat = (items: SertifikatItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SERTIFIKAT, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving sertifikat:', e);
  }
};

export const getStoredPengaturan = (): PengaturanMadrasah => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PENGATURAN);
    return data ? JSON.parse(data) : MADRASAH_INFO;
  } catch {
    return MADRASAH_INFO;
  }
};

export const saveStoredPengaturan = (data: PengaturanMadrasah) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PENGATURAN, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving pengaturan:', e);
  }
};

export const resetAllDataToDefault = () => {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
};
