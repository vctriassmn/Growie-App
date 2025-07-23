// File: context/JournalAndArticleStore.js

import React, { createContext, useState, useContext } from 'react';
import { Image } from 'react-native';

// Helper untuk mendapatkan URI dari require(), karena editor butuh URI yang absolut.
const babySpinachUri = Image.resolveAssetSource(require('../assets/images/babyspinach.png')).uri;
const peaceLilyUri = Image.resolveAssetSource(require('../assets/images/peacelily.png')).uri;
const caramenyiramUri = Image.resolveAssetSource(require('../assets/images/caramenyiram.png')).uri;
const plantUri = Image.resolveAssetSource(require('../assets/images/plant.png')).uri;
const wateringUri = Image.resolveAssetSource(require('../assets/images/Watering.png')).uri;
const customPlantUri = Image.resolveAssetSource(require('../assets/images/customplant.png')).uri;
const logoUri = Image.resolveAssetSource(require('../assets/images/Logo.png')).uri;
const ppUri = Image.resolveAssetSource(require('../assets/images/pp.jpg')).uri;
const alatGardeningUri = Image.resolveAssetSource(require('../assets/images/alatgardening.png')).uri;

const initialJournalData = {
    'My Baby Spinach': [
        { 
            id: '1a', 
            title: 'Memulai Petualangan Bayam!',
            content: `
                <p>
                    Hari ini adalah hari yang besar! Saya akhirnya memulai jurnal untuk tanaman baby spinach saya. 
                    Saya sudah lama ingin menanam sayuran sendiri di rumah, dan bayam sepertinya pilihan yang tepat untuk pemula. 
                    Prosesnya cukup sederhana, saya menyiapkan pot berukuran sedang dengan campuran tanah yang gembur dan pupuk kompos.
                </p>
                <img src="${babySpinachUri}" style="width: 100%; border-radius: 15px; margin-top: 10px; margin-bottom: 10px;" />
                <p>
                    Saya menabur benih secara merata dan menutupinya dengan lapisan tanah tipis. Setelah itu, saya menyiramnya dengan hati-hati 
                    menggunakan semprotan agar tidak menggeser benih. Potnya sekarang saya letakkan di dekat jendela yang mendapat sinar matahari pagi. 
                    Tidak sabar melihat tunas pertama muncul! Saya merasa sangat optimis dengan proyek kecil ini.
                </p>
            ` 
        },
        // --- PERBAIKAN: ID harus unik, tidak boleh ada duplikat '2a' ---
        { 
            id: '2a-unique', 
            title: 'Checklist Perawatan Hari Ini',
            content: `
                <p>Belum ada perubahan signifikan yang terlihat, tapi penting untuk menjaga rutinitas. Berikut adalah daftar tugas untuk hari ini:</p>
                <div style="margin-top: 10px;">
                    <div><input type="checkbox" checked />  Memeriksa kelembaban tanah (terasa masih lembab).</div>
                    <div><input type="checkbox" />  Memastikan drainase pot tidak tersumbat.</div>
                    <div><input type="checkbox" checked />  Memutar pot agar semua sisi mendapat cahaya.</div>
                    <div><input type="checkbox" />  Memberi semangat pada benih (ini bagian terpenting!).</div>
                </div>
                <p style="margin-top: 15px;">Semoga besok atau lusa sudah ada tanda-tanda kehidupan. Sabar adalah kunci dalam berkebun!</p>
            `
        },
        { 
            id: '3a', 
            title: 'Tunas Pertama Muncul!',
            content: `
                <p>
                    Ya Tuhan! Pagi ini saat saya mengecek, saya melihat ada beberapa tunas hijau kecil yang menyembul dari permukaan tanah!
                    Rasanya luar biasa sekali. Kerja keras (meskipun baru 3 hari) terasa terbayar. Ukurannya masih sangat kecil,
                    tapi ini adalah tanda bahwa mereka hidup dan bertumbuh.
                </p>
                <img src="${babySpinachUri}" style="width: 100%; border-radius: 15px; margin-top: 10px; margin-bottom: 10px;" />
                <p>
                    Saya langsung menyiramnya sedikit dengan sangat perlahan. Saya tidak akan memberikan pupuk dulu sampai daunnya sedikit lebih besar.
                    Hari ini adalah hari yang sangat membahagiakan dalam perjalanan berkebun saya.
                </p>
            `
        },
    ],
    'Nanem Jagung': [
        { 
            id: '1b', 
            title: 'Proyek Ambisius: Menanam Jagung',
            content: `
                <p>
                    Setelah sukses dengan bayam, saya memutuskan untuk mencoba sesuatu yang lebih menantang: jagung! 
                    Saya tahu jagung biasanya ditanam di lahan yang luas, tapi saya menemukan varietas yang konon bisa tumbuh di pot besar.
                    Saya menggunakan pot berdiameter 50cm dan mengisinya dengan tanah subur.
                </p>
                <img src="${peaceLilyUri}" style="width: 100%; border-radius: 15px; margin-top: 10px; margin-bottom: 10px;" />
                <p>
                    Saya menanam 3 biji jagung di satu pot, membentuk segitiga kecil. Menurut petunjuk, ini akan membantu penyerbukan nantinya.
                    Ini terasa seperti sebuah eksperimen besar. Apakah akan berhasil? Entahlah, tapi saya sangat bersemangat untuk mencari tahu.
                    Semoga berhasil, jagung-jagungku!
                </p>
            `
        },
        { 
            id: '2b', 
            title: 'Rencana Penyiraman dan Observasi',
            content: `
                <p>
                    Karena potnya jauh lebih besar, menjaga kelembaban tanah menjadi tantangan baru. Saya harus memastikan air meresap sampai ke bawah
                    tanpa membuat bagian atas terlalu becek.
                </p>
                <h4>Tugas untuk minggu pertama:</h4>
                <div><input type="checkbox" checked />  Siram setiap 2 hari sekali, atau saat permukaan tanah mulai kering.</div>
                <div><input type="checkbox" />  Periksa hama atau penyakit setiap pagi.</div>
                <div><input type="checkbox" />  Catat kapan tunas pertama muncul.</div>
                <br>
                <p>Saya juga menempatkan pot di tempat yang paling banyak terkena sinar matahari di balkon. Jagung butuh banyak sekali cahaya. Ini akan menjadi perjalanan yang menarik.</p>
            `
        },
    ],
    'Daily Progress': [],
    'Beginner Guide': [],
};

const initialJournalOrder = [
    'My Baby Spinach',
    'Nanem Jagung',
    'Daily Progress',
    'Beginner Guide',
];

const initialArticleData = [
    { id: '1', name: 'How to Plant a New Houseplant', description: 'A beginner-friendly guide...', image: caramenyiramUri, avatar: logoUri, username: 'Growie', category: 'growie', date: 'July 1, 2025', photoOfTheDayImage: alatGardeningUri, quote: '"Every thriving plant begins with good planting habits."', fullArticle: `Planting a new houseplant is the first step toward a greener, fresher home...` },
    { id: '2', name: 'Fiddle Leaf Fig', description: 'A popular indoor tree...', image: plantUri, avatar: ppUri, username: 'User123', category: 'latest', date: 'June 28, 2025', photoOfTheDayImage: plantUri, quote: '"Standing tall and bringing joy."', fullArticle: `My Fiddle Leaf Fig is finally thriving! After a bit of a struggle...` },
    { id: '3', name: 'Snake Plant', description: 'Extremely hardy and low-maintenance...', image: plantUri, avatar: ppUri, username: 'GreenThumb', category: 'trending', date: 'July 2, 2025', photoOfTheDayImage: plantUri, quote: '"Unbothered and thriving."', fullArticle: `The Snake Plant continues to be my most reliable houseplant...` },
    { id: '4', name: 'How to Water Your Plant', description: 'Learn when, how much, and how often...', image: wateringUri, avatar: logoUri, username: 'Growie', category: 'growie', date: 'July 3, 2025', photoOfTheDayImage: alatGardeningUri, quote: '"Water with care not too much, not too little."', fullArticle: `Watering seems simple, but it’s one of the most common reasons plants thrive...` },
    { id: '5', name: 'ZZ Plant', description: 'Drought-tolerant, shiny leaves...', image: plantUri, avatar: ppUri, username: 'LazyGardener', category: 'latest', date: 'June 29, 2025', photoOfTheDayImage: plantUri, quote: '"Thriving on pure neglect."', fullArticle: `The ZZ Plant truly lives up to to its reputation...` },
    { id: '6', name: 'Peace Lily', description: 'Elegant plant with white spathes...', image: peaceLilyUri, avatar: ppUri, username: 'BloomBuddy', category: 'trending', date: 'July 4, 2025', photoOfTheDayImage: peaceLilyUri, quote: '"Flowering peace in every corner."', fullArticle: `My Peace Lily just bloomed again...` },
    { id: '7', name: 'My Custom Plant', description: 'A plant I have grown myself!', image: customPlantUri, avatar: ppUri, username: 'MySelf', category: 'publish', date: 'July 7, 2025', photoOfTheDayImage: plantUri, quote: '"My green creation, growing strong!"', fullArticle: `Today marks a milestone for my custom plant project!...` },
];

const JournalAndArticleContext = createContext();

export const useJournalAndArticle = () => useContext(JournalAndArticleContext);

export const JournalAndArticleProvider = ({ children }) => {
    const [journals, setJournals] = useState(initialJournalData);
    const [journalOrder, setJournalOrder] = useState(initialJournalOrder);
    
    const [publishedArticles, setPublishedArticles] = useState([]);
    const [activeTab, setActiveTab] = useState('all');

    const getJournalFolders = () => journalOrder.map(title => ({ id: title, title: title }));

    const addJournalFolder = (newFolder) => {
        if (!journals[newFolder.title]) {
            setJournals(prevJournals => ({ ...prevJournals, [newFolder.title]: [] }));
            setJournalOrder(prevOrder => [...prevOrder, newFolder.title]);
        }
    };
    
    const deleteJournalFolders = (folderTitlesToDelete) => {
        setJournals(prevJournals => {
            const newJournals = { ...prevJournals };
            folderTitlesToDelete.forEach(title => { delete newJournals[title]; });
            return newJournals;
        });
        setJournalOrder(prevOrder => prevOrder.filter(title => !folderTitlesToDelete.includes(title)));
    };

    const addJournalEntry = (folderTitle, newEntry) => {
        setJournals(prevJournals => {
            const newJournals = { ...prevJournals };
            if (!newJournals[folderTitle]) { newJournals[folderTitle] = []; }
            newJournals[folderTitle].push(newEntry);
            return newJournals;
        });
    };

    const deleteJournalEntries = (folderTitle, entryIds) => {
        setJournals(prevJournals => {
            const newJournals = { ...prevJournals };
            newJournals[folderTitle] = newJournals[folderTitle].filter(entry => !entryIds.includes(entry.id));
            return newJournals;
        });
    };

    const renameJournalFolder = (oldTitle, newTitle) => {
        if (!newTitle || newTitle === oldTitle) return;
        setJournals(currentJournals => {
            const updatedJournals = { ...currentJournals };
            const entriesToMove = updatedJournals[oldTitle];
            if (entriesToMove) {
                updatedJournals[newTitle] = entriesToMove;
                delete updatedJournals[oldTitle];
            }
            return updatedJournals;
        });
        setJournalOrder(currentOrder => {
            const index = currentOrder.indexOf(oldTitle);
            const newOrder = [...currentOrder];
            if (index > -1) { newOrder[index] = newTitle; }
            return newOrder;
        });
    };
    
    const getJournalEntriesByTitle = (title) => journals[title] || [];
    const getJournalEntryById = (folderTitle, entryId) => (journals[folderTitle] || []).find(entry => entry.id === entryId);
    const updateJournalEntry = (folderTitle, entryId, updates) => {
        setJournals(prevJournals => {
            const newJournals = { ...prevJournals };
            const folderEntries = newJournals[folderTitle] ? [...newJournals[folderTitle]] : [];
            const entryIndex = folderEntries.findIndex(entry => entry.id === entryId);

            if (entryIndex !== -1) {
                // Menggabungkan data entri lama dengan data baru dari 'updates' ({title, content})
                folderEntries[entryIndex] = { ...folderEntries[entryIndex], ...updates };
                newJournals[folderTitle] = folderEntries;
            }
            
            return newJournals;
        });
    };

    // --- PERBAIKAN: Menambahkan fungsi 'publishJournalEntries' yang hilang ---
    const publishJournalEntries = (folderTitle, entriesToPublish) => {
        const newArticles = entriesToPublish.map(entry => ({
            id: `pub-${entry.id}`,
            name: entry.title,
            description: entry.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 50) + '...',
            image: customPlantUri,
            avatar: ppUri,
            username: 'MySelf',
            category: 'publish',
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            photoOfTheDayImage: plantUri,
            quote: `"${entry.title}"`,
            fullArticle: entry.content,
        }));
        
        setPublishedArticles(prev => [...prev, ...newArticles]);
        console.log('Published:', newArticles);
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
        publishJournalEntries, // Pastikan diekspor
        getJournalEntryById,
        updateJournalEntry,
        publishedArticles,
        activeTab,
        setActiveTab,
    };

    return (
        <JournalAndArticleContext.Provider value={value}>
            {children}
        </JournalAndArticleContext.Provider>
    );
};