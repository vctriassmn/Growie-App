// File: app/journalData.js

// Array ini akan menjadi sumber kebenaran untuk urutan folder
export const journalFolderOrder = [
    'My Baby Spinach',
    'Nanem Jagung',
    'Daily Progress',
    'Beginner Guide',
    'Folder 5',
    'Folder 6',
    'Folder 7',
    'Folder 8',
];

export const allJournalEntries = {
  'My Baby Spinach': [
    { id: '1a', day: 'Day - 1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim...' },
    { id: '2a', day: 'Day - 2', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim...' },
    { id: '3a', day: 'Day - 3', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim...' },
    { id: '4a', day: 'Day - 4', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim...' },
    { id: '5a', day: 'Day - 5', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim...' },
  ],
  'Nanem Jagung': [
    { id: '1b', day: 'Hari Ke-1', content: 'Mulai menanam jagung, semoga tumbuh subur.' },
    { id: '2b', day: 'Hari Ke-2', content: 'Penyiraman pertama, tanah masih lembab.' },
  ],
  'Daily Progress': [
    { id: '1c', day: 'Progress 1', content: 'Mencatat kemajuan harian.' },
  ],
  'Beginner Guide': [
    { id: '1d', day: 'Guide 1', content: 'Panduan dasar memulai berkebun.' },
  ],
  'Folder 5': [],
  'Folder 6': [],
  'Folder 7': [],
  'Folder 8': [],
};

// Fungsi ini sekarang menggunakan journalFolderOrder untuk mempertahankan urutan
export const getJournalFolders = () => {
    return journalFolderOrder.map((title) => ({
        id: title,
        title: title,
    }));
};

export const getJournalEntriesByTitle = (title) => {
    return allJournalEntries[title] || [];
};

export const deleteJournalEntries = (folderTitle, entryIdsToDelete) => {
    const currentEntries = allJournalEntries[folderTitle] || [];
    const newEntries = currentEntries.filter(item => !entryIdsToDelete.has(item.id));
    allJournalEntries[folderTitle] = newEntries;
};

// Tambahkan folder baru ke data dan ke array urutan
export const addJournalFolder = (newFolder) => {
    if (!allJournalEntries[newFolder.title]) {
        allJournalEntries[newFolder.title] = [];
        journalFolderOrder.push(newFolder.title); // Tambahkan ke urutan juga
    }
};

export const addJournalEntry = (folderTitle, newEntry) => {
    if (allJournalEntries[folderTitle]) {
        allJournalEntries[folderTitle].push(newEntry);
    }
};

export const renameJournalFolder = (oldTitle, newTitle) => {
    if (allJournalEntries[oldTitle] && oldTitle !== newTitle) {
        // Cari indeks folder lama di array urutan
        const oldIndex = journalFolderOrder.indexOf(oldTitle);
        
        // Perbarui entri
        allJournalEntries[newTitle] = allJournalEntries[oldTitle];
        delete allJournalEntries[oldTitle];

        // Perbarui array urutan di posisi yang sama
        if (oldIndex > -1) {
            journalFolderOrder[oldIndex] = newTitle;
        }
    }
};