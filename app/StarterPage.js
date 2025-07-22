// import React, { useState, useRef } from 'react';
// import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
// import PagerView from 'react-native-pager-view';
// import { useNavigation } from 'expo-router';

// const { width } = Dimensions.get('window');

// // Data untuk setiap halaman starter
// // Ganti path gambar dengan path aktual di proyek Anda
// const pages = [
//   {
//     image: require('../assets/images/Logo.png'), // Gambar untuk Halaman 1
//     title: 'Growie',
//     description: '',
//     showSkip: false,
//     showPrev: false,
//   },
//   {
//     image: require('../assets/images/Start1.png'), // Gambar untuk Halaman 2
//     title: 'Meet Growie,\nYour gentle plant care buddy',
//     description: 'We help you care for your plants—one friendly reminder at a time.',
//     showSkip: true,
//     showPrev: false,
//   },
//   {
//     image: require('../assets/images/Start2.png'), // Gambar untuk Halaman 3
//     title: 'Stay on Track\nWatering, sunlight & more',
//     description: 'Growie sends smart reminders tailored to your plant’s needs.',
//     showSkip: false,
//     showPrev: true,
//   },
//   {
//     image: require('../assets/images/Start3.png'), // Gambar untuk Halaman 4
//     title: 'Grow with Confidence\nSee your greens flourish',
//     description: 'Your plants, your schedule. Growie keeps it simple and joyful.',
//     showSkip: false,
//     showPrev: true,
//   },
// ];

// export default function StarterPage() {
//   const [currentPage, setCurrentPage] = useState(0);
//   const pagerRef = useRef(null);
//   const navigation = useNavigation(); // Hook untuk mendapatkan objek navigasi

//   // Fungsi untuk maju ke halaman berikutnya
//   const goToNextPage = () => {
//     if (currentPage < pages.length - 1) {
//       pagerRef.current?.setPage(currentPage + 1);
//     } else {
//       // Jika ini halaman terakhir, navigasi ke navigator tab utama
//       navigation.replace('(tabs)'); // Mengganti stack navigasi agar tidak bisa kembali ke onboarding
//     }
//   };

//   // Fungsi untuk mundur ke halaman sebelumnya
//   const goToPrevPage = () => {
//     if (currentPage > 0) {
//       pagerRef.current?.setPage(currentPage - 1);
//     }
//   };

//   // Fungsi untuk melewati semua halaman starter
//   const skipOnboarding = () => {
//     navigation.replace('(tabs)'); // Langsung navigasi ke navigator tab utama
//   };

//   return (
//     <View style={styles.container}>
//       <PagerView
//         style={styles.pagerView}
//         initialPage={0}
//         ref={pagerRef}
//         onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
//       >
//         {pages.map((page, index) => (
//           <View key={index} style={styles.page}>
//             {/* Header 'Started Page' */}
//             <Text style={styles.pageHeader}>Started Page {index + 1}</Text>

//             {/* Konten Halaman */}
//             <View style={styles.contentContainer}>
//               <Image
//                 source={page.image}
//                 style={styles.image}
//                 onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/E0E0E0/333333?text=Error'; }} // Fallback
//               />
//               <Text style={styles.title}>{page.title}</Text>
//               {page.description ? <Text style={styles.description}>{page.description}</Text> : null}
//             </View>

//             {/* Indikator halaman (dots) - Diposisikan secara absolut di dalam halaman */}
//             <View style={styles.dotContainerAbsolute}>
//               {pages.map((_, dotIndex) => (
//                 <TouchableOpacity // Membuat dots dapat diklik
//                   key={dotIndex}
//                   onPress={() => pagerRef.current?.setPage(dotIndex)}
//                   style={[
//                     styles.dot,
//                     dotIndex === currentPage ? styles.activeDot : styles.inactiveDot,
//                   ]}
//                 />
//               ))}
//             </View>

//             {/* Kontrol Navigasi Bawah - Diposisikan secara absolut di dalam halaman */}
//             <View style={styles.bottomNavigationAbsolute}>
//               {/* Bagian kiri untuk Skip atau Prev */}
//               <View style={styles.leftButtonsWrapper}>
//                 {pages[currentPage].showSkip && (
//                   <TouchableOpacity onPress={skipOnboarding} style={styles.skipButton}>
//                     <Text style={styles.skipButtonText}>Skip</Text>
//                   </TouchableOpacity>
//                 )}
//                 {pages[currentPage].showPrev && (
//                   <TouchableOpacity onPress={goToPrevPage} style={styles.prevButton}>
//                     <Text style={styles.prevButtonText}>Prev</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>

//               {/* Tombol Next di kanan */}
//               <TouchableOpacity onPress={goToNextPage} style={styles.nextButton}>
//                 <Text style={styles.nextButtonText}>Next</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}
//       </PagerView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   pagerView: {
//     flex: 1,
//   },
//   page: {
//     flex: 1,
//     alignItems: 'center',
//     paddingTop: 50, // Ruang untuk header 'Started Page'
//     paddingHorizontal: 20,
//     paddingBottom: 180, // Mengurangi padding bawah untuk memberi ruang lebih pada tombol navigasi dan dots
//   },
//   pageHeader: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   contentContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     width: 150,
//     height: 150,
//     resizeMode: 'contain',
//     marginBottom: 40,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//     color: '#333',
//   },
//   description: {
//     fontSize: 16,
//     textAlign: 'center',
//     color: '#666',
//     paddingHorizontal: 20,
//   },
//   dotContainerAbsolute: { // Gaya baru untuk dots yang diposisikan absolut
//     flexDirection: 'row',
//     position: 'absolute',
//     bottom: 160, // Memindahkan dots lebih tinggi
//   },
//   dot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     marginHorizontal: 5,
//     backgroundColor: '#ccc', // Default inactive dot color
//   },
//   activeDot: {
//     backgroundColor: '#5c8d5c', // Warna hijau untuk dot aktif
//   },
//   inactiveDot: {
//     backgroundColor: '#ccc', // Warna abu-abu untuk dot tidak aktif
//   },
//   bottomNavigationAbsolute: { // Gaya baru untuk navigasi bawah yang diposisikan absolut
//     flexDirection: 'row',
//     justifyContent: 'space-between', // Memastikan elemen kiri dan kanan terpisah
//     alignItems: 'center',
//     position: 'absolute',
//     bottom: 90, // Memindahkan tombol lebih tinggi, dekat dengan dots
//     width: '100%', // Memastikan tombol membentang selebar halaman
//     paddingHorizontal: 20, // Menambahkan padding horizontal
//   },
//   leftButtonsWrapper: { // Wrapper baru untuk tombol Skip/Prev
//     flexDirection: 'row',
//     alignItems: 'center',
//     // Tidak perlu justify-content di sini karena hanya akan ada satu tombol aktif pada satu waktu
//   },
//   skipButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   skipButtonText: {
//     fontSize: 16,
//     color: '#666',
//   },
//   prevButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   prevButtonText: {
//     fontSize: 16,
//     color: '#666',
//   },
//   nextButton: {
//     backgroundColor: '#5c8d5c', // Warna hijau untuk tombol Next
//     paddingVertical: 10,
//     paddingHorizontal: 25,
//     borderRadius: 25, // Bentuk pil
//   },
//   nextButtonText: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   placeholderButton: {
//     // Placeholder tidak lagi diperlukan dalam struktur baru ini
//     // ini hanya untuk menjaga kompatibilitas jika masih ada referensi di tempat lain
//     width: 0,
//     height: 0,
//   }
// });
