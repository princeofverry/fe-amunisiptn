export interface Sekolah {
  id: string;
  npsn: string;
  sekolah: string;
  bentuk: string; // "SMA" | "SMK"
  status: string;
  alamat_jalan: string;
  kecamatan: string;
  kabupaten_kota: string;
  propinsi: string;
}

export const mockSchools: Sekolah[] = [
  // Jakarta
  { id: "1", npsn: "20101011", sekolah: "SMAN 8 JAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Taman Bukit Duri", kecamatan: "Tebet", kabupaten_kota: "Jakarta Selatan", propinsi: "DKI Jakarta" },
  { id: "2", npsn: "20101012", sekolah: "SMAN 28 JAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Ragunan Raya", kecamatan: "Pasar Minggu", kabupaten_kota: "Jakarta Selatan", propinsi: "DKI Jakarta" },
  { id: "3", npsn: "20101013", sekolah: "SMAN 70 JAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Bulungan", kecamatan: "Kebayoran Baru", kabupaten_kota: "Jakarta Selatan", propinsi: "DKI Jakarta" },
  { id: "4", npsn: "20101014", sekolah: "SMAN 68 JAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Salemba Raya", kecamatan: "Senen", kabupaten_kota: "Jakarta Pusat", propinsi: "DKI Jakarta" },
  { id: "5", npsn: "20101015", sekolah: "SMAN 81 JAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Kartika Eka Paksi", kecamatan: "Makasar", kabupaten_kota: "Jakarta Timur", propinsi: "DKI Jakarta" },
  { id: "6", npsn: "20101016", sekolah: "SMAN 14 JAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Cililitan Besar", kecamatan: "Kramat Jati", kabupaten_kota: "Jakarta Timur", propinsi: "DKI Jakarta" },
  { id: "7", npsn: "20101017", sekolah: "SMAN 39 JAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. R.A. Fadillah", kecamatan: "Pasar Rebo", kabupaten_kota: "Jakarta Timur", propinsi: "DKI Jakarta" },
  { id: "8", npsn: "20101018", sekolah: "SMAN 48 JAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Pinang Ranti", kecamatan: "Makasar", kabupaten_kota: "Jakarta Timur", propinsi: "DKI Jakarta" },
  { id: "9", npsn: "20101019", sekolah: "SMAN 12 JAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. P. Komarudin", kecamatan: "Klender", kabupaten_kota: "Jakarta Timur", propinsi: "DKI Jakarta" },
  { id: "10", npsn: "20101020", sekolah: "SMAN 2 JAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Gajah Mada", kecamatan: "Taman Sari", kabupaten_kota: "Jakarta Barat", propinsi: "DKI Jakarta" },
  { id: "11", npsn: "20101021", sekolah: "SMAN 3 JAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Setiabudi II", kecamatan: "Setiabudi", kabupaten_kota: "Jakarta Selatan", propinsi: "DKI Jakarta" },
  { id: "12", npsn: "20101022", sekolah: "SMAN 5 JAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Sumur Batu Raya", kecamatan: "Kemayoran", kabupaten_kota: "Jakarta Pusat", propinsi: "DKI Jakarta" },
  { id: "13", npsn: "20101023", sekolah: "SMAN 6 JAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Mahakam", kecamatan: "Kebayoran Baru", kabupaten_kota: "Jakarta Selatan", propinsi: "DKI Jakarta" },
  { id: "14", npsn: "20101024", sekolah: "SMA TARUNA NUSANTARA", bentuk: "SMA", status: "S", alamat_jalan: "Jl. Purworejo", kecamatan: "Mertoyudan", kabupaten_kota: "Magelang", propinsi: "Jawa Tengah" },
  { id: "15", npsn: "20101025", sekolah: "SMAN 1 BOGOR", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Ir. H. Juanda No. 16", kecamatan: "Bogor Tengah", kabupaten_kota: "Bogor", propinsi: "Jawa Barat" },
  { id: "16", npsn: "20101026", sekolah: "SMAN 1 DEPOK", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Nusantara Raya", kecamatan: "Pancoran Mas", kabupaten_kota: "Depok", propinsi: "Jawa Barat" },
  { id: "17", npsn: "20101027", sekolah: "SMAN 1 BEKASI", bentuk: "SMA", status: "N", alamat_jalan: "Jl. KH. Agus Salim No. 181", kecamatan: "Bekasi Timur", kabupaten_kota: "Bekasi", propinsi: "Jawa Barat" },
  { id: "18", npsn: "20101028", sekolah: "SMAN 1 TANGERANG", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Daan Mogot No. 50", kecamatan: "Sukarasa", kabupaten_kota: "Tangerang", propinsi: "Banten" },
  { id: "19", npsn: "20101029", sekolah: "SMAN 1 TANGSEL", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Pendidikan", kecamatan: "Ciputat", kabupaten_kota: "Tangerang Selatan", propinsi: "Banten" },
  { id: "20", npsn: "20101030", sekolah: "SMAN 5 SURABAYA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Kusuma Bangsa No. 21", kecamatan: "Genteng", kabupaten_kota: "Surabaya", propinsi: "Jawa Timur" },
  { id: "21", npsn: "20101031", sekolah: "SMAN 1 MALANG", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Tugu Utara No. 1", kecamatan: "Klojen", kabupaten_kota: "Malang", propinsi: "Jawa Timur" },
  { id: "22", npsn: "20101032", sekolah: "SMAN 3 MALANG", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Sultan Agung No. 7", kecamatan: "Klojen", kabupaten_kota: "Malang", propinsi: "Jawa Timur" },
  { id: "23", npsn: "20101033", sekolah: "SMAN 1 YOGYAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. HOS Cokroaminoto No. 10", kecamatan: "Wirobrajan", kabupaten_kota: "Yogyakarta", propinsi: "DI Yogyakarta" },
  { id: "24", npsn: "20101034", sekolah: "SMAN 3 YOGYAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Yos Sudarso No. 7", kecamatan: "Gondokusuman", kabupaten_kota: "Yogyakarta", propinsi: "DI Yogyakarta" },
  { id: "25", npsn: "20101035", sekolah: "SMAN 8 YOGYAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Sidobali No. 1", kecamatan: "Umbulharjo", kabupaten_kota: "Yogyakarta", propinsi: "DI Yogyakarta" },
  { id: "26", npsn: "20101036", sekolah: "SMAN 1 SEMARANG", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Taman Menteri Supeno No. 1", kecamatan: "Semarang Selatan", kabupaten_kota: "Semarang", propinsi: "Jawa Tengah" },
  { id: "27", npsn: "20101037", sekolah: "SMAN 3 SEMARANG", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Pemuda No. 149", kecamatan: "Semarang Tengah", kabupaten_kota: "Semarang", propinsi: "Jawa Tengah" },
  { id: "28", npsn: "20101038", sekolah: "SMAN 1 SURAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Monginsidi No. 40", kecamatan: "Banjarsari", kabupaten_kota: "Surakarta", propinsi: "Jawa Tengah" },
  { id: "29", npsn: "20101039", sekolah: "SMAN 4 SURAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. L.S. Adi Sucipto No. 1", kecamatan: "Banjarsari", kabupaten_kota: "Surakarta", propinsi: "Jawa Tengah" },
  { id: "30", npsn: "20101040", sekolah: "SMAN 1 PURWOKERTO", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Gatot Subroto No. 73", kecamatan: "Purwokerto Timur", kabupaten_kota: "Banyumas", propinsi: "Jawa Tengah" },
  { id: "31", npsn: "20101041", sekolah: "SMAN 2 PURWOKERTO", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Gatot Subroto No. 69", kecamatan: "Purwokerto Timur", kabupaten_kota: "Banyumas", propinsi: "Jawa Tengah" },
  { id: "32", npsn: "20101042", sekolah: "SMAN 1 TEGAL", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Menteri Supeno No. 16", kecamatan: "Tegal Timur", kabupaten_kota: "Tegal", propinsi: "Jawa Tengah" },
  { id: "33", npsn: "20101043", sekolah: "SMAN 1 PEKALONGAN", bentuk: "SMA", status: "N", alamat_jalan: "Jl. RA Kartini No. 39", kecamatan: "Pekalongan Timur", kabupaten_kota: "Pekalongan", propinsi: "Jawa Tengah" },
  { id: "34", npsn: "20101044", sekolah: "SMAN 1 PATI", bentuk: "SMA", status: "N", alamat_jalan: "Jl. P. Sudirman No. 24", kecamatan: "Pati", kabupaten_kota: "Pati", propinsi: "Jawa Tengah" },
  { id: "35", npsn: "20101045", sekolah: "SMAN 1 KUDUS", temp: 'temp' } as any,
  { id: "36", npsn: "20101046", sekolah: "SMAN 1 JEPARA", temp: 'temp' } as any,
  { id: "37", npsn: "20101047", sekolah: "SMAN 1 MAGELANG", temp: 'temp' } as any,
  { id: "38", npsn: "20101048", sekolah: "SMAN 1 KLATEN", temp: 'temp' } as any,
  { id: "39", npsn: "20101049", sekolah: "SMAN 1 BOYOLALI", temp: 'temp' } as any,
  { id: "40", npsn: "20101050", sekolah: "SMAN 1 WONOSOBO", temp: 'temp' } as any,
  { id: "41", npsn: "20101051", sekolah: "SMAN 1 PURBALINGGA", temp: 'temp' } as any,
  { id: "42", npsn: "20101052", sekolah: "SMAN 1 CILACAP", temp: 'temp' } as any,
  { id: "43", npsn: "20101053", sekolah: "SMAN 1 PEMALANG", temp: 'temp' } as any,
  { id: "44", npsn: "20101054", sekolah: "SMAN 1 BANJARNEGARA", temp: 'temp' } as any,
  { id: "45", npsn: "20101055", sekolah: "SMAN 1 SRAGEN", temp: 'temp' } as any,
  { id: "46", npsn: "20101056", sekolah: "SMAN 1 KARANGANYAR", temp: 'temp' } as any,
  { id: "47", npsn: "20101057", sekolah: "SMAN 1 SALATIGA", temp: 'temp' } as any,
  { id: "48", npsn: "20101058", sekolah: "SMKN 1 JAKARTA", bentuk: "SMK", status: "N", alamat_jalan: "Jl. Budi Utomo No. 7", kecamatan: "Sawah Besar", kabupaten_kota: "Jakarta Pusat", propinsi: "DKI Jakarta" },
  { id: "49", npsn: "20101059", sekolah: "SMKN 2 JAKARTA", bentuk: "SMK", status: "N", alamat_jalan: "Jl. Batu No. 3", kecamatan: "Gambir", kabupaten_kota: "Jakarta Pusat", propinsi: "DKI Jakarta" },
  { id: "50", npsn: "20101060", sekolah: "SMKN 3 JAKARTA", bentuk: "SMK", status: "N", alamat_jalan: "Jl. Garuda No. 63", kecamatan: "Kemayoran", kabupaten_kota: "Jakarta Pusat", propinsi: "DKI Jakarta" },
  { id: "51", npsn: "20101061", sekolah: "SMKN 4 JAKARTA", bentuk: "SMK", status: "N", alamat_jalan: "Jl. Rorotan VI", kecamatan: "Cilincing", kabupaten_kota: "Jakarta Utara", propinsi: "DKI Jakarta" },
  { id: "52", npsn: "20101062", sekolah: "SMKN 5 JAKARTA", bentuk: "SMK", status: "N", alamat_jalan: "Jl. Pisangan Baru Timur", kecamatan: "Matraman", kabupaten_kota: "Jakarta Timur", propinsi: "DKI Jakarta" },
  { id: "53", npsn: "20101063", sekolah: "SMKN 6 JAKARTA", bentuk: "SMK", status: "N", alamat_jalan: "Jl. Prof. Joko Suton", kecamatan: "Kebayoran Baru", kabupaten_kota: "Jakarta Selatan", propinsi: "DKI Jakarta" },
  { id: "54", npsn: "20101064", sekolah: "SMKN 7 JAKARTA", temp: 'temp' } as any,
  { id: "55", npsn: "20101065", sekolah: "SMKN 8 JAKARTA", temp: 'temp' } as any,
  { id: "56", npsn: "20101066", sekolah: "SMKN 9 JAKARTA", temp: 'temp' } as any,
  { id: "57", npsn: "20101067", sekolah: "SMKN 10 JAKARTA", temp: 'temp' } as any,
  { id: "58", npsn: "20101068", sekolah: "SMKN 15 JAKARTA", temp: 'temp' } as any,
  { id: "59", npsn: "20101069", sekolah: "SMKN 20 JAKARTA", temp: 'temp' } as any,
  { id: "60", npsn: "20101070", sekolah: "SMKN 26 JAKARTA", bentuk: "SMK", status: "N", alamat_jalan: "Jl. Balai Pustaka Baru I", kecamatan: "Pulo Gadung", kabupaten_kota: "Jakarta Timur", propinsi: "DKI Jakarta" },
  { id: "61", npsn: "20101071", sekolah: "SMKN 36 JAKARTA", temp: 'temp' } as any,
  { id: "62", npsn: "20101072", sekolah: "SMKN 42 JAKARTA", temp: 'temp' } as any,
  { id: "63", npsn: "20101073", sekolah: "SMKN 45 JAKARTA", temp: 'temp' } as any,
  { id: "64", npsn: "20101074", sekolah: "SMKN 48 JAKARTA", temp: 'temp' } as any,
  { id: "65", npsn: "20101075", sekolah: "SMKN 50 JAKARTA", temp: 'temp' } as any,
  { id: "66", npsn: "20101076", sekolah: "SMKN 57 JAKARTA", temp: 'temp' } as any,
  { id: "67", npsn: "20101077", sekolah: "SMKN 1 BANDUNG", bentuk: "SMK", status: "N", alamat_jalan: "Jl. Wastukencana No. 3", kecamatan: "Bandung Wetan", kabupaten_kota: "Bandung", propinsi: "Jawa Barat" },
  { id: "68", npsn: "20101078", sekolah: "SMKN 2 BANDUNG", bentuk: "SMK", status: "N", alamat_jalan: "Jl. Ciliwung No. 4", kecamatan: "Bandung Wetan", kabupaten_kota: "Bandung", propinsi: "Jawa Barat" },
  { id: "69", npsn: "20101079", sekolah: "SMKN 3 BANDUNG", bentuk: "SMK", status: "N", alamat_jalan: "Jl. Solontongan No. 10", kecamatan: "Lengkong", kabupaten_kota: "Bandung", propinsi: "Jawa Barat" },
  { id: "70", npsn: "20101080", sekolah: "SMKN 4 BANDUNG", bentuk: "SMK", status: "N", alamat_jalan: "Jl. Kliningan No. 6", kecamatan: "Lengkong", kabupaten_kota: "Bandung", propinsi: "Jawa Barat" },
  { id: "71", npsn: "20101081", sekolah: "SMKN 5 BANDUNG", temp: 'temp' } as any,
  { id: "72", npsn: "20101082", sekolah: "SMKN 6 BANDUNG", temp: 'temp' } as any,
  { id: "73", npsn: "20101083", sekolah: "SMKN 7 BANDUNG", temp: 'temp' } as any,
  { id: "74", npsn: "20101084", sekolah: "SMKN 8 BANDUNG", temp: 'temp' } as any,
  { id: "75", npsn: "20101085", sekolah: "SMKN 9 BANDUNG", temp: 'temp' } as any,
  { id: "76", npsn: "20101086", sekolah: "SMKN 1 SURABAYA", bentuk: "SMK", status: "N", alamat_jalan: "Jl. SMEA No. 4", kecamatan: "Wonokromo", kabupaten_kota: "Surabaya", propinsi: "Jawa Timur" },
  { id: "77", npsn: "20101087", sekolah: "SMKN 2 SURABAYA", temp: 'temp' } as any,
  { id: "78", npsn: "20101088", sekolah: "SMKN 3 SURABAYA", temp: 'temp' } as any,
  { id: "79", npsn: "20101089", sekolah: "SMKN 4 SURABAYA", temp: 'temp' } as any,
  { id: "80", npsn: "20101090", sekolah: "SMKN 5 SURABAYA", temp: 'temp' } as any,
  { id: "81", npsn: "20101091", sekolah: "SMKN 6 SURABAYA", temp: 'temp' } as any,
  { id: "82", npsn: "20101092", sekolah: "SMKN 7 SURABAYA", temp: 'temp' } as any,
  { id: "83", npsn: "20101093", sekolah: "SMKN 8 SURABAYA", temp: 'temp' } as any,
  { id: "84", npsn: "20101094", sekolah: "SMKN 1 MALANG", bentuk: "SMK", status: "N", alamat_jalan: "Jl. Sonokembang", kecamatan: "Klojen", kabupaten_kota: "Malang", propinsi: "Jawa Timur" },
  { id: "85", npsn: "20101095", sekolah: "SMKN 2 MALANG", temp: 'temp' } as any,
  { id: "86", npsn: "20101096", sekolah: "SMKN 3 MALANG", temp: 'temp' } as any,
  { id: "87", npsn: "20101097", sekolah: "SMKN 4 MALANG", temp: 'temp' } as any,
  { id: "88", npsn: "20101098", sekolah: "SMKN 5 MALANG", temp: 'temp' } as any,
  { id: "89", npsn: "20101099", sekolah: "SMKN 1 YOGYAKARTA", temp: 'temp' } as any,
  { id: "90", npsn: "20101100", sekolah: "SMKN 2 YOGYAKARTA", temp: 'temp' } as any,
  { id: "91", npsn: "20101101", sekolah: "SMKN 3 YOGYAKARTA", temp: 'temp' } as any,
  { id: "92", npsn: "20101102", sekolah: "SMKN 4 YOGYAKARTA", temp: 'temp' } as any,
  { id: "93", npsn: "20101103", sekolah: "SMKN 1 SEMARANG", temp: 'temp' } as any,
  { id: "94", npsn: "20101104", sekolah: "SMKN 2 SEMARANG", temp: 'temp' } as any,
  { id: "95", npsn: "20101105", sekolah: "SMKN 3 SEMARANG", temp: 'temp' } as any,
  { id: "96", npsn: "20101106", sekolah: "SMKN 4 SEMARANG", temp: 'temp' } as any,
  { id: "97", npsn: "20101107", sekolah: "SMKN 5 SEMARANG", temp: 'temp' } as any,
  { id: "98", npsn: "20101108", sekolah: "SMKN 6 SEMARANG", temp: 'temp' } as any,
  { id: "99", npsn: "20101109", sekolah: "SMKN 7 SEMARANG", bentuk: "SMK", status: "N", alamat_jalan: "Jl. Simpang Lima", kecamatan: "Semarang Selatan", kabupaten_kota: "Semarang", propinsi: "Jawa Tengah" },
  { id: "100", npsn: "20101110", sekolah: "SMA MAN 1 JAKARTA", bentuk: "SMA", status: "N", alamat_jalan: "Jl. Grogol", kecamatan: "Grogol", kabupaten_kota: "Jakarta Barat", propinsi: "DKI Jakarta" }
].map(s => ({
  ...s,
  id: s.id || String(Math.random()),
  npsn: s.npsn || '0000',
  sekolah: s.sekolah,
  bentuk: s.bentuk || (s.sekolah.includes('SMK') ? 'SMK' : 'SMA'),
  status: s.status || 'N',
  alamat_jalan: s.alamat_jalan || 'Jl. Pendidikan',
  kecamatan: s.kecamatan || 'Kec. Pusat',
  kabupaten_kota: s.kabupaten_kota || 'Kota Terpadu',
  propinsi: s.propinsi || 'Provinsi'
}));

export const preloadSekolah = async (): Promise<Sekolah[]> => {
  return mockSchools;
};

export const searchSekolah = async (
  keyword: string,
  _fallbackList: Sekolah[],
): Promise<Sekolah[]> => {
  const lower = keyword.toLowerCase();
  return mockSchools.filter(s => s.sekolah.toLowerCase().includes(lower));
};
