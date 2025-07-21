// File: src/context/JournalAndArticleStore.js

import React, { createContext, useState, useContext } from 'react';

// Data Dummy Jurnal (sekarang berada di sini)
const initialJournalData = {
    'My Baby Spinach': [
        { id: '1a', day: 'Day - 1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        { id: '2a', day: 'Day - 2', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        { id: '3a', day: 'Day - 3', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        { id: '4a', day: 'Day - 4', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        { id: '5a', day: 'Day - 5', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
    ],
    'Nanem Jagung': [
        { id: '1b', day: 'Hari Ke-1', content: 'Mulai menanam jagung, semoga tumbuh subur. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Mulai menanam jagung, semoga tumbuh subur. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
        { id: '2b', day: 'Hari Ke-2', content: 'Penyiraman pertama, tanah masih lembab. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
    ],
};

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
    // Artikel dengan kategori 'publish' untuk My Publish
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
    const [journals, setJournals] = useState(initialJournalData);
    const [publishedArticles, setPublishedArticles] = useState([]); // State untuk artikel yang dipublikasikan
    const [activeTab, setActiveTab] = useState('all');

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

    const deleteJournalEntries = (folderTitle, entryIds) => {
        setJournals(prevJournals => {
            const newJournals = { ...prevJournals };
            newJournals[folderTitle] = newJournals[folderTitle].filter(entry => !entryIds.includes(entry.id));
            return newJournals;
        });
    };

    const publishJournalEntries = (folderTitle, entriesToPublish) => {
        setPublishedArticles(prevArticles => {
            const newPublishedArticles = entriesToPublish.map(entry => ({
                id: `published-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ID unik dan acak
                name: entry.day || `Journal from ${folderTitle}`,
                description: entry.content || 'A journal entry published by a user.',
                image: require('../assets/images/customplant.png'),
                avatar: require('../assets/images/pp.jpg'),
                username: 'MySelf',
                category: 'publish', // **PERBAIKAN:** Menggunakan 'publish'
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                photoOfTheDayImage: require('../assets/images/plant.png'),
                quote: `"My green creation, growing strong!"`,
                fullArticle: entry.content
            }));
            
            // **PERBAIKAN:** Menambahkan artikel yang baru dipublikasi di bagian atas daftar
            return [...newPublishedArticles, ...prevArticles];
        });
    };

    const deletePublishedArticles = (articleIds) => {
        setPublishedArticles(prevArticles => prevArticles.filter(article => !articleIds.includes(article.id)));
    };

    const value = {
        journals,
        articles: [...initialArticleData, ...publishedArticles], // Menggabungkan artikel awal dan yang dipublikasikan
        publishedArticles,
        activeTab,
        setActiveTab,
        addJournalEntry,
        deleteJournalEntries,
        publishJournalEntries,
        deletePublishedArticles,
    };

    return (
        <JournalAndArticleContext.Provider value={value}>
            {children}
        </JournalAndArticleContext.Provider>
    );
};