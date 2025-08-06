/**
 * Mengubah string HTML menjadi teks biasa yang bersih.
 * @param {string} html - String HTML yang akan dibersihkan.
 * @returns {string} Teks biasa tanpa tag HTML.
 */
const htmlToText = (html) => {
    if (!html) {
        return ''; // Kembalikan string kosong jika input tidak valid
    }

    let text = html;

    // 1. Ganti tag block-level (<p>, <div>, <br>) dengan spasi atau baris baru agar paragraf tidak menyatu
    // Kita gunakan dua baris baru untuk membuat jarak antar paragraf
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<\/p>|<\/div>|<\/h[1-6]>/gi, '\n\n');

    // 2. Hapus SEMUA tag HTML yang tersisa
    text = text.replace(/<[^>]+>/g, '');

    // 3. (Opsional) Ubah entitas HTML umum menjadi karakternya
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');

    // 4. Hapus spasi atau baris baru berlebih di awal dan akhir
    return text.trim();
};