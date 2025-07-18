// File: app/journalData.js

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

const journalFolders = Object.keys(allJournalEntries).map((key, index) => ({
    id: String(index + 1),
    title: key,
    // Kita tidak perlu gambar di sini, kita akan mengelola visual di Journal.js
}));

export const getJournalFolders = () => journalFolders;

export const getJournalEntriesByTitle = (title) => {
    return allJournalEntries[title] || [];
};

export const deleteJournalEntries = (folderTitle, entryIdsToDelete) => {
    const currentEntries = allJournalEntries[folderTitle] || [];
    const newEntries = currentEntries.filter(item => !entryIdsToDelete.has(item.id));
    allJournalEntries[folderTitle] = newEntries;
};

// Fungsi ini hanya untuk demo, dalam aplikasi nyata, Anda akan menggunakan state atau context