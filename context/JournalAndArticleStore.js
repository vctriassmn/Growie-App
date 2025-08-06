// Lokasi File: context/JournalAndArticleStore.js

import React, { createContext, useState, useContext } from 'react';
import { Image } from 'react-native';

// Helper untuk mendapatkan URI absolut dari gambar lokal
const babySpinachUri = Image.resolveAssetSource(require('../assets/images/babyspinach.png')).uri;
const peaceLilyUri = Image.resolveAssetSource(require('../assets/images/peacelily.png')).uri;
const caramenyiramUri = Image.resolveAssetSource(require('../assets/images/caramenyiram.png')).uri;
const plantUri = Image.resolveAssetSource(require('../assets/images/plant.png')).uri;
const wateringUri = Image.resolveAssetSource(require('../assets/images/Watering.png')).uri;
const customPlantUri = Image.resolveAssetSource(require('../assets/images/customplant.png')).uri;
const logoUri = Image.resolveAssetSource(require('../assets/images/Logo.png')).uri;
const ppUri = Image.resolveAssetSource(require('../assets/images/pp.jpg')).uri;
const alatGardeningUri = Image.resolveAssetSource(require('../assets/images/alatgardening.png')).uri;
const sukulenUri = Image.resolveAssetSource(require('../assets/images/babyspinach.png')).uri;
const anggrekUri = Image.resolveAssetSource(require('../assets/images/babyspinach.png')).uri;

// --- DATA DUMMY JURNAL YANG DIPERBANYAK ---
const initialJournalData = {
    'My Baby Spinach': [
        { 
            id: '1a', 
            title: 'Memulai Petualangan Bayam!',
            content: `
                <p>
                    Hari ini adalah hari yang besar! Saya akhirnya memulai jurnal untuk tanaman baby spinach saya. 
                    Saya sudah lama ingin menanam sayuran sendiri di rumah, dan bayam sepertinya pilihan yang tepat untuk pemula karena siklus hidupnya yang relatif singkat.
                    Prosesnya cukup sederhana, saya menyiapkan pot berukuran sedang dengan campuran tanah yang gembur dan pupuk kompos yang sudah matang. Saya memastikan pot memiliki lubang drainase yang baik di bagian bawah untuk mencegah akar tergenang air, yang merupakan kesalahan umum bagi pemula.
                </p>
                <img src="${babySpinachUri}" style="width: 100%; border-radius: 15px; margin-top: 10px; margin-bottom: 10px;" />
                <p>
                    Saya menabur benih secara merata di permukaan tanah, mencoba memberi jarak beberapa sentimeter antar benih, meskipun agak sulit. Setelah itu, saya menutupinya dengan lapisan tanah tipis, sekitar setengah sentimeter saja. 
                    Saya menyiramnya dengan sangat hati-hati menggunakan semprotan halus (mist sprayer) agar tidak menggeser posisi benih. Potnya sekarang saya letakkan di dekat jendela dapur yang mendapat sinar matahari pagi yang lembut, sekitar 4-5 jam sehari.
                    Tidak sabar melihat tunas pertama muncul! Saya merasa sangat optimis dengan proyek kecil ini dan berharap bisa memanen bayam segar untuk salad dalam beberapa minggu ke depan.
                </p>
            ` 
        },
        { 
            id: '2a-unique', 
            title: 'Checklist Perawatan Hari Ini',
            content: `
                <p>Belum ada perubahan signifikan yang terlihat di permukaan tanah, tapi saya tahu kesabaran adalah kunci. Penting untuk tetap menjaga rutinitas perawatan agar benih mendapatkan kondisi terbaik untuk berkecambah. Berikut adalah daftar tugas yang saya lakukan hari ini:</p>
                <div style="margin-top: 10px; padding-left: 15px; border-left: 3px solid #D9ECE1; ">
                    <div><input type="checkbox" checked />  <b>Memeriksa kelembaban tanah:</b> Saya menyentuh permukaan tanah, terasa masih lembab tapi tidak becek. Jadi, tidak perlu disiram hari ini.</div>
                    <div><input type="checkbox" />  <b>Memastikan drainase:</b> Saya mengangkat pot untuk memastikan tidak ada air yang menggenang di piringan bawah. Semuanya kering, pertanda baik.</div>
                    <div><input type="checkbox" checked />  <b>Memutar pot 180 derajat:</b> Ini untuk memastikan, jika nanti sudah bertunas, semua bagian tanaman akan mendapat paparan cahaya yang merata dan tidak tumbuh miring.</div>
                    <div><input type="checkbox" />  <b>Memberi semangat pada benih:</b> Mungkin terdengar konyol, tapi saya percaya energi positif itu membantu. Saya membisikkan kata-kata semangat pada pot pagi ini.</div>
                </div>
                <p style="margin-top: 15px;">Saya membaca bahwa benih bayam biasanya butuh 5-10 hari untuk berkecambah, tergantung suhu dan kondisi. Jadi, saya akan tetap sabar dan konsisten. Semoga besok atau lusa sudah ada tanda-tanda kehidupan hijau yang mungil!</p>
            `
        },
        { 
            id: '3a', 
            title: 'Tunas Pertama Muncul!',
            content: `
                <p>
                    <b>Ya Tuhan! Pagi ini keajaiban terjadi!</b> Saat saya mengecek pot seperti biasa, saya melihat ada beberapa titik hijau kecil yang sangat mungil menyembul dari permukaan tanah!
                    Rasanya luar biasa sekali melihat kehidupan baru yang tumbuh dari benih yang saya tanam sendiri. Kerja keras dan kesabaran (meskipun baru 3 hari) terasa sangat terbayar. Ukurannya masih sangat kecil, mungkin hanya beberapa milimeter,
                    tapi ini adalah tanda bahwa mereka hidup dan bertumbuh dengan baik.
                </p>
                <img src="${babySpinachUri}" style="width: 100%; border-radius: 15px; margin-top: 10px; margin-bottom: 10px;" />
                <p>
                    Saya langsung mengambil semprotan dan menyiramnya sedikit dengan sangat perlahan, hanya untuk membasahi permukaan tanah di sekitarnya. Saya tidak akan memberikan pupuk dulu sampai daun sejatinya (daun kedua yang muncul) tumbuh sedikit lebih besar.
                    Hari ini adalah hari yang sangat membahagiakan dalam perjalanan berkebun saya. Ini benar-benar membuktikan bahwa dengan sedikit usaha, kita bisa menumbuhkan makanan kita sendiri. Saya akan terus memantau pertumbuhannya setiap hari.
                </p>
            `
        },
    ],
    'Kisah Si Peace Lily': [
        {
            id: 'c1',
            title: 'Adopsi Anggota Keluarga Baru',
            content: `
                <p>Hari ini saya tidak bisa menahan diri saat berkunjung ke toko tanaman. Saya melihat Peace Lily (Spathiphyllum) yang begitu anggun dengan daun hijau tuanya yang mengkilap dan bunga putihnya yang unik. Tanpa pikir panjang, saya memutuskan untuk "mengadopsinya".</p>
                <img src="${peaceLilyUri}" style="width: 100%; border-radius: 15px; margin-top: 10px; margin-bottom: 10px;" />
                <p>Saya memberinya tempat di sudut ruang tamu yang tidak terkena sinar matahari langsung, karena saya tahu tanaman ini lebih suka cahaya teduh. Saya juga memeriksa kelembaban tanahnya, dan sepertinya pas, tidak terlalu kering atau basah. Katanya, Peace Lily adalah tanaman yang cukup "cerewet" dan akan menunjukkan jika ia haus dengan daunnya yang terkulai. Semoga kami bisa berteman baik!</p>
            `
        },
        {
            id: 'c2',
            title: 'Drama Daun Menguning',
            content: `
                <p>Astaga, kepanikan melanda pagi ini. Saya menemukan salah satu daun bagian bawah Peace Lily saya mulai menguning. Saya langsung mencari tahu di internet. Ada beberapa kemungkinan: terlalu banyak air, terlalu sedikit air, atau kelebihan pupuk.</p>
                <p>Melihat riwayat penyiraman, saya curiga saya telah memberinya terlalu banyak air. Saya akan mencoba mengurangi frekuensi penyiraman dan hanya akan menyiram ketika permukaan tanah sudah mulai kering. Saya juga memotong daun yang kuning agar tanaman bisa fokus pada pertumbuhan daun baru yang sehat. Semoga ini adalah keputusan yang tepat. Jari-jari disilangkan!</p>
            `
        }
    ],
    'Nanem Jagung': [
        { 
            id: '1b', 
            title: 'Proyek Ambisius: Menanam Jagung di Pot',
            content: `
                <p>
                    Setelah merasa cukup percaya diri dengan bayam, saya memutuskan untuk mencoba sesuatu yang lebih menantang dan mungkin sedikit nekat: menanam jagung di dalam pot besar! 
                    Saya tahu jagung biasanya ditanam di lahan yang sangat luas, tapi saya menemukan varietas jagung manis kerdil yang konon bisa tumbuh dengan baik di dalam kontainer.
                    Saya menggunakan pot terakota berdiameter 50cm dan mengisinya dengan campuran tanah kebun, kompos, dan sedikit pasir untuk drainase yang baik.
                </p>
                <img src="${plantUri}" style="width: 100%; border-radius: 15px; margin-top: 10px; margin-bottom: 10px;" />
                <p>
                    Saya menanam 4 biji jagung di satu pot, membentuk formasi kotak kecil. Menurut beberapa panduan yang saya baca, menanam dalam blok seperti ini akan membantu proses penyerbukan yang dibantu oleh angin nantinya, bahkan dalam skala kecil.
                    Ini terasa seperti sebuah eksperimen sains besar di balkon saya. Apakah akan berhasil? Apakah akan menghasilkan tongkol jagung yang bisa dimakan? Entahlah, tapi saya sangat bersemangat untuk mencari tahu.
                    Semoga berhasil, jagung-jagungku! Saya berjanji akan memberikan kalian banyak sinar matahari dan air.
                </p>
            `
        },
    ],
    'Taman Herbal Mini': [],
};

const initialJournalOrder = [
    'My Baby Spinach',
    'Kisah Si Peace Lily',
    'Nanem Jagung',
    'Taman Herbal Mini',
];

const initialArticleData = [
    { id: '1', name: 'Cara Tepat Menanam Tanaman Hias Baru', description: 'Panduan ramah pemula untuk memastikan tanaman Anda tumbuh subur sejak hari pertama...', image: caramenyiramUri, avatar: logoUri, username: 'Growie', category: 'growie', date: 'July 1, 2025', photoOfTheDayImage: alatGardeningUri, quote: '"Setiap tanaman yang subur dimulai dari kebiasaan menanam yang baik."', fullArticle: `<h1>Langkah Awal Menuju Rumah yang Lebih Hijau</h1><p>Menanam tanaman hias baru adalah langkah pertama yang menyenangkan menuju rumah yang lebih hijau dan segar. Namun, proses ini lebih dari sekadar memindahkan tanaman dari pot plastik ke pot baru. Untuk memastikan teman hijau baru Anda beradaptasi dan tumbuh subur, ikuti panduan lengkap ini.</p><h2>1. Pilih Pot yang Tepat</h2><p>Ukuran adalah kunci. Pilih pot yang hanya 2-4 cm lebih besar diameternya dari pot aslinya. Pot yang terlalu besar dapat menahan terlalu banyak air dan menyebabkan akar busuk. Pastikan pot memiliki lubang drainase yang cukup.</p><h2>2. Siapkan Media Tanam Berkualitas</h2><p>Jangan gunakan tanah dari kebun Anda. Beli media tanam khusus tanaman hias (potting mix) yang steril dan memiliki campuran seimbang antara tanah, kompos, dan bahan lain seperti perlite atau vermiculite untuk aerasi.</p><h2>3. Proses Pemindahan (Repotting)</h2><p>Siram tanaman di pot aslinya beberapa jam sebelum dipindahkan. Ini akan membantu mengurangi stres pada akar. Keluarkan tanaman dengan hati-hati, jangan menarik batangnya. Longgarkan akar yang melingkar di bagian bawah dengan lembut menggunakan jari Anda. Letakkan lapisan media tanam di dasar pot baru, posisikan tanaman di tengah, dan isi sisa ruang dengan media tanam hingga beberapa sentimeter di bawah bibir pot. Padatkan dengan lembut dan siram hingga air keluar dari lubang drainase.</p><h2>4. Perawatan Pasca-Tanam</h2><p>Letakkan tanaman di lokasi dengan cahaya yang sesuai kebutuhannya, tetapi hindari sinar matahari langsung yang terik selama beberapa minggu pertama. Jaga kelembaban tanah tetapi jangan biarkan tergenang. Tunda pemupukan setidaknya selama satu bulan untuk memberi waktu bagi tanaman untuk pulih dan beradaptasi dengan rumah barunya.</p>` },
    { id: '2', name: 'Perjuangan Merawat Fiddle Leaf Fig', description: 'Kisah jujur tentang jatuh bangun merawat si cantik yang dramatis ini...', image: plantUri, avatar: ppUri, username: 'User123', category: 'latest', date: 'June 28, 2025', photoOfTheDayImage: plantUri, quote: '"Berdiri tegak dan membawa sukacita... setelah banyak drama."', fullArticle: `<h1>Hubungan Benci dan Cinta dengan Fiddle Leaf Fig</h1><p>Fiddle Leaf Fig (Ficus lyrata) saya akhirnya tumbuh subur! Setelah perjuangan panjang yang melibatkan daun rontok, bercak coklat, dan banyak keputusasaan, saya akhirnya menemukan ritme yang tepat. Ini adalah tanaman yang indah, tetapi jelas bukan untuk orang yang lemah hati.</p><h2>Kesalahan Saya</h2><p>Awalnya, saya terlalu sering menyiramnya. Saya juga menempatkannya terlalu dekat dengan jendela yang terkena angin. Tanaman ini membenci dua hal itu. Daun-daun bagian bawah mulai rontok satu per satu, dan saya hampir menyerah.</p><h2>Titik Balik</h2><p>Saya memutuskan untuk belajar serius. Saya hanya menyiram ketika 2-3 inci bagian atas tanah benar-benar kering. Saya memindahkannya ke sudut yang mendapat cahaya pagi yang terang tetapi tidak langsung. Saya juga mulai membersihkan daunnya yang besar dengan kain lembab setiap minggu untuk membantunya berfotosintesis dengan maksimal. Hasilnya? Daun baru yang sehat mulai bermunculan di puncak. Perasaan suksesnya tak ternilai!</p>` },
    { id: '3', name: '5 Kesalahan Umum Merawat Sukulen', description: 'Hindari kesalahan ini agar koleksi sukulen Anda tidak mati sia-sia...', image: sukulenUri, avatar: logoUri, username: 'Growie', category: 'trending', date: 'July 2, 2025', photoOfTheDayImage: sukulenUri, quote: '"Kurang perhatian seringkali lebih baik daripada terlalu banyak."', fullArticle: `<h1>Selamatkan Sukulen Anda!</h1><p>Sukulen terkenal sebagai tanaman yang mudah dirawat, tetapi banyak pemula justru membunuhnya dengan "kebaikan". Berikut adalah lima kesalahan paling umum yang harus Anda hindari:</p><ol><li><b>Menyiram Terlalu Sering:</b> Ini adalah pembunuh nomor satu. Sukulen menyimpan air di daunnya dan lebih suka kekeringan. Siram hanya ketika tanah benar-benar kering sepenuhnya.</li><li><b>Pot Tanpa Drainase:</b> Akar sukulen akan membusuk dengan cepat jika terendam air. Pot wajib memiliki lubang drainase.</li><li><b>Media Tanam yang Salah:</b> Sukulen membutuhkan media tanam yang sangat porous (cepat kering). Gunakan campuran kaktus/sukulen, atau buat sendiri dengan mencampur potting mix dengan pasir kasar atau perlite.</li><li><b>Kurang Sinar Matahari:</b> Sebagian besar sukulen membutuhkan setidaknya 6 jam cahaya terang setiap hari. Jika diletakkan di tempat gelap, mereka akan mengalami etiolasi (tumbuh memanjang dan pucat).</li><li><b>Membiarkan Air di Daun:</b> Jangan biarkan air menggenang di roset (tengah) sukulen, karena dapat menyebabkan pembusukan. Siram langsung ke tanah di sekitarnya.</li></ol><p>Dengan menghindari kesalahan ini, koleksi sukulen Anda akan tumbuh sehat dan indah.</p>` },
    { id: '4', name: 'Seni Menyiram Tanaman', description: 'Belajar kapan, berapa banyak, dan seberapa sering menyiram tanaman Anda...', image: wateringUri, avatar: logoUri, username: 'Growie', category: 'growie', date: 'July 3, 2025', photoOfTheDayImage: alatGardeningUri, quote: '"Sirami dengan perhatian—tidak terlalu banyak, tidak terlalu sedikit."', fullArticle: `<h1>Menyiram Bukan Sekadar Membasahi</h1><p>Menyiram tampaknya sederhana, tetapi ini adalah salah satu alasan paling umum mengapa tanaman hias gagal atau tumbuh subur. Kunci utamanya adalah memahami kebutuhan spesifik setiap tanaman.</p><h2>Kapan Harus Menyiram?</h2><p>Lupakan jadwal yang kaku. Cara terbaik adalah dengan memeriksa tanah. Masukkan jari Anda sekitar 2-3 cm ke dalam tanah. Jika terasa kering, saatnya menyiram. Jika masih lembab, tunggulah beberapa hari lagi. Tanaman yang berbeda memiliki kebutuhan yang berbeda; kaktus membutuhkan lebih sedikit air daripada pakis, misalnya.</p><h2>Berapa Banyak Air?</h2><p>Saat Anda menyiram, lakukan secara menyeluruh. Siram tanah secara merata sampai air mulai mengalir keluar dari lubang drainase di bagian bawah pot. Ini memastikan seluruh sistem akar mendapatkan air. Buang kelebihan air yang terkumpul di piringan pot.</p><h2>Kualitas Air</h2><p>Jika memungkinkan, gunakan air hujan atau air suling. Air keran seringkali mengandung mineral dan klorin yang dapat menumpuk di tanah seiring waktu dan membahayakan beberapa tanaman yang sensitif.</p>` },
    { id: '6', name: 'Pesona Anggrek Bulan di Rumahku', description: 'Kisah sukses membuat Anggrek Bulan (Phalaenopsis) berbunga kembali...', image: anggrekUri, avatar: ppUri, username: 'BloomBuddy', category: 'trending', date: 'July 4, 2025', photoOfTheDayImage: anggrekUri, quote: '"Bunga yang mekar adalah bukti kesabaran."', fullArticle: `<h1>Keindahan Abadi Anggrek Bulan</h1><p>Anggrek Bulan saya mekar lagi! Ini adalah momen yang selalu saya tunggu-tunggu. Banyak orang berpikir anggrek sulit dirawat dan akan membuangnya setelah bunganya rontok. Padahal, dengan sedikit trik, Anda bisa membuatnya berbunga lagi dan lagi.</p><h2>Rahasia Berbunga Kembali</h2><p>Setelah bunga terakhir layu, jangan buang tanamannya. Potong tangkai bunga di atas buku (nodus) kedua dari bawah. Kunci utamanya adalah memberikan perbedaan suhu antara siang dan malam. Selama beberapa minggu, saya memindahkan anggrek saya ke dekat jendela yang sedikit lebih dingin di malam hari. Penurunan suhu ini merangsang tanaman untuk menghasilkan tangkai bunga baru. Selain itu, pastikan ia mendapat cahaya terang tidak langsung dan kelembaban yang cukup. Jangan pernah biarkan akarnya tergenang air. Dengan kesabaran, Anda akan dihadiahi dengan bunga-bunga indah yang bertahan selama berbulan-bulan.</p>` },
    { id: '7', name: 'Jurnal Publik: Bayamku!', description: 'Ini adalah entri jurnal yang saya publikasikan tentang bayam saya...', image: customPlantUri, avatar: ppUri, username: 'MySelf', category: 'publish', date: 'July 7, 2025', photoOfTheDayImage: plantUri, quote: '"Kreasiku yang hijau, tumbuh kuat!"', fullArticle: `<h1>Dari Jurnal Pribadi ke Publik</h1><p>Hari ini menandai tonggak sejarah bagi proyek kebun kecil saya! Saya memutuskan untuk mempublikasikan salah satu entri jurnal saya. Ini adalah kisah tentang bagaimana saya memulai petualangan menanam bayam. Prosesnya sederhana, saya menyiapkan pot berukuran sedang dengan campuran tanah yang gembur dan pupuk kompos. Saya menabur benih secara merata dan menutupinya dengan lapisan tanah tipis. Setelah itu, saya menyiramnya dengan hati-hati menggunakan semprotan agar tidak menggeser benih. Potnya sekarang saya letakkan di dekat jendela yang mendapat sinar matahari pagi. Tidak sabar melihat tunas pertama muncul! Saya merasa sangat optimis dengan proyek kecil ini.</p>` },
];


const JournalAndArticleContext = createContext();

export const useJournalAndArticle = () => useContext(JournalAndArticleContext);

export const JournalAndArticleProvider = ({ children }) => {
    // State untuk data pengguna saat ini
    const [currentUser, setCurrentUser] = useState({
        username: 'My Name', // <-- Anda bisa mengubah nama ini
        avatar: ppUri       // URI untuk avatar pengguna
    });
    
    const [journals, setJournals] = useState(initialJournalData);
    const [journalOrder, setJournalOrder] = useState(initialJournalOrder);
    const [publishedArticles, setPublishedArticles] = useState([]);
    const [activeTab, setActiveTab] = useState('all');

    // ... (Fungsi-fungsi manajemen jurnal lain tidak berubah)
    const getJournalFolders = () => journalOrder.map(title => ({ id: title, title: title }));
    const addJournalFolder = (newFolder) => { if (!journals[newFolder.title]) { setJournals(prev => ({ ...prev, [newFolder.title]: [] })); setJournalOrder(prev => [...prev, newFolder.title]); } };
    const deleteJournalFolders = (folderTitlesToDelete) => { setJournals(prev => { const newJournals = { ...prev }; folderTitlesToDelete.forEach(title => delete newJournals[title]); return newJournals; }); setJournalOrder(prev => prev.filter(title => !folderTitlesToDelete.includes(title))); };
    const addJournalEntry = (folderTitle, newEntry) => { setJournals(prev => { const newJournals = { ...prev }; if (!newJournals[folderTitle]) { newJournals[folderTitle] = []; } newJournals[folderTitle].push(newEntry); return newJournals; }); };
    const deleteJournalEntries = (folderTitle, entryIds) => { setJournals(prev => { const newJournals = { ...prev }; newJournals[folderTitle] = newJournals[folderTitle].filter(entry => !entryIds.includes(entry.id)); return newJournals; }); };
    const renameJournalFolder = (oldTitle, newTitle) => { if (!newTitle || newTitle === oldTitle) return; setJournals(curr => { const upd = { ...curr }; const entries = upd[oldTitle]; if (entries) { upd[newTitle] = entries; delete upd[oldTitle]; } return upd; }); setJournalOrder(curr => { const idx = curr.indexOf(oldTitle); const newO = [...curr]; if (idx > -1) newO[idx] = newTitle; return newO; }); };
    const getJournalEntriesByTitle = (title) => journals[title] || [];
    const getJournalEntryById = (folderTitle, entryId) => (journals[folderTitle] || []).find(entry => entry.id === entryId);
    const updateJournalEntry = (folderTitle, entryId, updates) => { setJournals(prev => { const newJ = { ...prev }; const entries = newJ[folderTitle] ? [...newJ[folderTitle]] : []; const idx = entries.findIndex(e => e.id === entryId); if (idx !== -1) { entries[idx] = { ...entries[idx], ...updates }; newJ[folderTitle] = entries; } return newJ; }); };

    // --- FUNGSI PUBLIKASI YANG TELAH DIPERBAIKI ---
    const publishJournalEntries = (folderTitle, entriesToPublish) => {
        const newArticles = entriesToPublish.map(entry => {
            
           // --- INTI PERUBAHAN ---
            const imageMatch = entry.content.match(/<img[^>]+src="([^">]+)"/);
            // Jika ditemukan, gunakan gambar itu. Jika tidak, set nilainya ke null.
            const mainCoverImage = imageMatch ? imageMatch[1] : null; 

            return {
                id: `pub-${entry.id}`,
                name: entry.title,
                description: entry.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 80) + '...',
                
                image: mainCoverImage,
                
                avatar: currentUser.avatar,
                username: currentUser.username,
                category: 'publish',
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                photoOfTheDayImage: alatGardeningUri, 
                quote: `"${entry.title}"`,
                fullArticle: entry.content,
            };
        });
        
        setPublishedArticles(prev => [...prev, ...newArticles]);
    };

    const value = {
        journals,
        journalOrder,
        articles: [...initialArticleData, ...publishedArticles],
        getJournalFolders, 
        addJournalFolder,
        deleteJournalFolders,
        renameJournalFolder,
        getJournalEntriesByTitle,
        addJournalEntry,
        deleteJournalEntries,
        publishJournalEntries,
        getJournalEntryById,
        updateJournalEntry,
        publishedArticles,
        activeTab,
        setActiveTab,
        currentUser,
    };

    return (
        <JournalAndArticleContext.Provider value={value}>
            {children}
        </JournalAndArticleContext.Provider>
    );
};