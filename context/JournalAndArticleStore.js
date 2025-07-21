import React, { createContext, useState, useContext } from 'react';

// Data Dummy Jurnal yang digabungkan dari journalData.js
const initialJournalData = {
    'My Baby Spinach': [
        { id: '1a', day: 'Day - 1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', image: require('../assets/images/babyspinach.png') },
        { id: '2a', day: 'Day - 2', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', image: require('../assets/images/babyspinach.png') },
        { id: '3a', day: 'Day - 3', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', image: require('../assets/images/babyspinach.png') },
        { id: '4a', day: 'Day - 4', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', image: require('../assets/images/babyspinach.png') },
        { id: '5a', day: 'Day - 5', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', image: require('../assets/images/babyspinach.png') },
    ],
    'Nanem Jagung': [
        { id: '1b', day: 'Hari Ke-1', content: 'Mulai menanam jagung, semoga tumbuh subur. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Mulai menanam jagung, semoga tumbuh subur. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', image: require('../assets/images/peacelily.png') },
        { id: '2b', day: 'Hari Ke-2', content: 'Penyiraman pertama, tanah masih lembab. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', image: require('../assets/images/peacelily.png') },
    ],
    'Daily Progress': [],
    'Beginner Guide': [],
    'Folder 5': [],
    'Folder 6': [],
    'Folder 7': [],
    'Folder 8': [],
};

// Urutan folder yang terpisah untuk menjaga urutan tampilan
const initialJournalOrder = [
    'My Baby Spinach',
    'Nanem Jagung',
    'Daily Progress',
    'Beginner Guide',
    'Folder 5',
    'Folder 6',
    'Folder 7',
    'Folder 8',
];

const initialArticleData = [
    {
        id: '1', name: 'How to Plant a New Houseplant', description: 'A beginner-friendly guide...', image: require('../assets/images/caramenyiram.png'),
        avatar: require('../assets/images/Logo.png'), username: 'Growie', category: 'growie', date: 'July 1, 2025',
        photoOfTheDayImage: require('../assets/images/alatgardening.png'), quote: '"Every thriving plant begins with good planting habits."',
        fullArticle: `Planting a new houseplant is the first step toward a greener, fresher home...`
    },
    {
        id: '2', name: 'Fiddle Leaf Fig', description: 'A popular indoor tree...', image: require('../assets/images/plant.png'),
        avatar: require('../assets/images/pp.jpg'), username: 'User123', category: 'latest', date: 'June 28, 2025',
        photoOfTheDayImage: require('../assets/images/plant.png'), quote: '"Standing tall and bringing joy."',
        fullArticle: `My Fiddle Leaf Fig is finally thriving! After a bit of a struggle...`
    },
    {
        id: '3', name: 'Snake Plant', description: 'Extremely hardy and low-maintenance...', image: require('../assets/images/plant.png'),
        avatar: require('../assets/images/pp.jpg'), username: 'GreenThumb', category: 'trending', date: 'July 2, 2025',
        photoOfTheDayImage: require('../assets/images/plant.png'), quote: '"Unbothered and thriving."',
        fullArticle: `The Snake Plant continues to be my most reliable houseplant...`
    },
    {
        id: '4', name: 'How to Water Your Plant', description: 'Learn when, how much, and how often...', image: require('../assets/images/Watering.png'),
        avatar: require('../assets/images/Logo.png'), username: 'Growie', category: 'growie', date: 'July 3, 2025',
        photoOfTheDayImage: require('../assets/images/alatgardening.png'), quote: '"Water with care not too much, not too little."',
        fullArticle: `Watering seems simple, but it’s one of the most common reasons plants thrive...`
    },
    {
        id: '5', name: 'ZZ Plant', description: 'Drought-tolerant, shiny leaves...', image: require('../assets/images/plant.png'),
        avatar: require('../assets/images/pp.jpg'), username: 'LazyGardener', category: 'latest', date: 'June 29, 2025',
        photoOfTheDayImage: require('../assets/images/plant.png'), quote: '"Thriving on pure neglect."',
        fullArticle: `The ZZ Plant truly lives up to to its reputation...`
    },
    {
        id: '6', name: 'Peace Lily', description: 'Elegant plant with white spathes...', image: require('../assets/images/peacelily.png'),
        avatar: require('../assets/images/pp.jpg'), username: 'BloomBuddy', category: 'trending', date: 'July 4, 2025',
        photoOfTheDayImage: require('../assets/images/peacelily.png'), quote: '"Flowering peace in every corner."',
        fullArticle: `My Peace Lily just bloomed again...`
    },
    {
        id: '7', name: 'My Custom Plant', description: 'A plant I have grown myself!', image: require('../assets/images/customplant.png'),
        avatar: require('../assets/images/pp.jpg'), username: 'MySelf', category: 'publish', date: 'July 7, 2025',
        photoOfTheDayImage: require('../assets/images/plant.png'), quote: '"My green creation, growing strong!"',
        fullArticle: `Today marks a milestone for my custom plant project!...`
    },
];

const JournalAndArticleContext = createContext();

export const useJournalAndArticle = () => useContext(JournalAndArticleContext);

export const JournalAndArticleProvider = ({ children }) => {
    // Kita sekarang memiliki dua state untuk jurnal untuk menjaga urutan
    const [journals, setJournals] = useState(initialJournalData);
    const [journalOrder, setJournalOrder] = useState(initialJournalOrder);
    
    const [publishedArticles, setPublishedArticles] = useState([]);
    const [activeTab, setActiveTab] = useState('all');

    // Fungsi untuk mendapatkan semua folder jurnal
    const getJournalFolders = () => {
        return journalOrder.map(title => ({
            id: title,
            title: title,
        }));
    };

    // Fungsi untuk menambahkan folder baru
    const addJournalFolder = (newFolder) => {
        if (!journals[newFolder.title]) {
            setJournals(prevJournals => ({
                ...prevJournals,
                [newFolder.title]: []
            }));
            setJournalOrder(prevOrder => [...prevOrder, newFolder.title]);
        }
    };
    
    // Fungsi untuk menghapus folder
    const deleteJournalFolders = (folderTitlesToDelete) => {
        setJournals(prevJournals => {
            const newJournals = { ...prevJournals };
            folderTitlesToDelete.forEach(title => {
                delete newJournals[title];
            });
            return newJournals;
        });

        setJournalOrder(prevOrder => 
            prevOrder.filter(title => !folderTitlesToDelete.includes(title))
        );
    };

    // Fungsi untuk menambahkan entri jurnal baru
    const addJournalEntry = (folderTitle, newEntry) => {
        setJournals(prevJournals => {
            const newJournals = { ...prevJournals };
            if (!newJournals[folderTitle]) {
                newJournals[folderTitle] = [];
            }
            newJournals[folderTitle].push(newEntry);
            return newJournals;
        });
    };

    // Fungsi untuk menghapus entri jurnal
    const deleteJournalEntries = (folderTitle, entryIds) => {
        setJournals(prevJournals => {
            const newJournals = { ...prevJournals };
            newJournals[folderTitle] = newJournals[folderTitle].filter(entry => !entryIds.includes(entry.id));
            return newJournals;
        });
    };

    // --- FUNGSI YANG DIPERBARUI ---
    const renameJournalFolder = (oldTitle, newTitle) => {
        // Hentikan fungsi jika judul baru tidak valid atau sama dengan yang lama
        if (!newTitle || newTitle === oldTitle) {
            return;
        }

        // 1. Perbarui state data (objek journals)
        setJournals(currentJournals => {
            const updatedJournals = { ...currentJournals };
            const entriesToMove = updatedJournals[oldTitle];

            if (entriesToMove) {
                updatedJournals[newTitle] = entriesToMove;
                delete updatedJournals[oldTitle];
            }

            return updatedJournals;
        });

        // 2. Perbarui state urutan (array journalOrder)
        setJournalOrder(currentOrder => {
            const index = currentOrder.indexOf(oldTitle);
            const newOrder = [...currentOrder];
            if (index > -1) {
                newOrder[index] = newTitle;
            }
            return newOrder;
        });
    };
    // --- AKHIR FUNGSI YANG DIPERBARUI ---
    
    // Fungsi untuk mendapatkan entri jurnal berdasarkan judul folder
    const getJournalEntriesByTitle = (title) => {
        return journals[title] || [];
    };

    // Fungsi untuk mempublikasikan entri jurnal
    const publishJournalEntries = (folderTitle, entriesToPublish) => {
    setPublishedArticles(prevArticles => {
        const newPublishedArticles = entriesToPublish.map(entry => ({
            id: `published-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: entry.day || `Journal from ${folderTitle}`,
            description: entry.content || 'A journal entry published by a user.',
            image: entry.image,
            
            avatar: require('../assets/images/pp.jpg'), // Tetap gunakan avatar default
            username: 'MySelf',
            category: 'publish',
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            photoOfTheDayImage: entry.image || require('../assets/images/plant.png'), // Gunakan gambar jurnal juga untuk photo of the day
            quote: `"My green creation, growing strong!"`,
            fullArticle: entry.content
        }));
        
        return [...newPublishedArticles, ...prevArticles];
    });
};

    const deletePublishedArticles = (articleIds) => {
        setPublishedArticles(prevArticles => prevArticles.filter(article => !articleIds.includes(article.id)));
    };

    // --- FUNGSI BARU ANDA ---
    const getJournalEntryById = (folderTitle, entryId) => {
        const folderEntries = journals[folderTitle] || [];
        return folderEntries.find(entry => entry.id === entryId);
    };


    const value = {
        journals,
        journalOrder,
        articles: [...initialArticleData, ...publishedArticles],
        publishedArticles,
        activeTab,
        setActiveTab,
        getJournalFolders, 
        addJournalFolder,
        deleteJournalFolders,
        addJournalEntry,
        deleteJournalEntries,
        renameJournalFolder,
        getJournalEntriesByTitle, 
        publishJournalEntries,
        deletePublishedArticles,
        getJournalEntryById, // <--- BARIS YANG HILANG SEBELUMNYA
    };


    return (
        <JournalAndArticleContext.Provider value={value}>
            {children}
        </JournalAndArticleContext.Provider>
    );
};
