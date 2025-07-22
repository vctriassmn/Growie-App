// Lokasi file: app/Login.js (Nama file di sini harusnya StarterPage.js berdasarkan konteks)

import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const pages = [
  {
    image: require('../assets/images/Logo.png'),
    title: 'Growie',
    description: '',
    showSkip: false,
    showPrev: false,
  },
  {
    image: require('../assets/images/Start1.png'),
    title: 'Meet Growie,\nYour gentle plant care buddy',
    description: 'We help you care for your plants—one friendly reminder at a time.',
    showSkip: true,
    showPrev: false,
  },
  {
    image: require('../assets/images/Start2.png'),
    title: 'Stay on Track\nWatering, sunlight & more',
    description: 'Growie sends smart reminders tailored to your plant’s needs.',
    showSkip: false,
    showPrev: true,
  },
  {
    image: require('../assets/images/Start3.png'),
    title: 'Grow with Confidence\nSee your greens flourish',
    description: 'Your plants, your schedule. Growie keeps it simple and joyful.',
    showSkip: false,
    showPrev: true,
  },
];

export default function StarterPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef(null);
  const router = useRouter();

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      // Jika ini adalah halaman terakhir, navigasi ke halaman Login
      router.replace('/Login');
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      pagerRef.current?.setPage(currentPage - 1);
    }
  };

  const skipOnboarding = () => {
    router.replace('/(tabs)');
  };

  // Fungsi goToRegister dan goToLogin tidak lagi diperlukan karena tombolnya dihapus
  // const goToRegister = () => {
  //   router.replace('/Register');
  // };

  // const goToLogin = () => {
  //   router.replace('/Login');
  // };

  return (
    <View style={styles.container}>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {pages.map((page, index) => (
          <View key={index} style={styles.page}>
            <Text style={styles.pageHeader}>Started Page {index + 1}</Text>

            <View style={styles.contentContainer}>
              <Image source={page.image} style={styles.image} />
              <Text style={styles.title}>{page.title}</Text>
              {page.description ? <Text style={styles.description}>{page.description}</Text> : null}
            </View>

            <View style={styles.dotContainer}>
              {pages.map((_, dotIndex) => (
                <TouchableOpacity
                  key={dotIndex}
                  onPress={() => pagerRef.current?.setPage(dotIndex)}
                  style={[
                    styles.dot,
                    dotIndex === currentPage ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>

            {/* Tombol Register dan Login dihapus dari sini */}
            {/* {currentPage === pages.length - 1 && (
              <View style={styles.authButtonsWrapper}>
                <TouchableOpacity onPress={goToRegister} style={styles.registerButton}>
                  <Text style={styles.authButtonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToLogin} style={styles.loginButton}>
                  <Text style={styles.authButtonText}>Login</Text>
                </TouchableOpacity>
              </View>
            )} */}

            {/* Navigasi bawah: Skip, Prev, dan Next */}
            <View style={styles.bottomNavigation}>
              <View style={styles.leftButtonsWrapper}>
                {/* Tombol Skip hanya muncul di halaman 2 */}
                {index === 1 && ( // Menggunakan index untuk spesifik halaman kedua
                  <TouchableOpacity onPress={skipOnboarding} style={styles.skipButton}>
                    <Text style={styles.navText}>Skip</Text>
                  </TouchableOpacity>
                )}
                {/* Tombol Prev muncul dari halaman 3 dan seterusnya */}
                {index >= 2 && ( // Menggunakan index untuk spesifik halaman ketiga dan seterusnya
                  <TouchableOpacity onPress={goToPrevPage} style={styles.prevButton}>
                    <Text style={styles.navText}>Prev</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Tombol Next selalu muncul */}
              <TouchableOpacity onPress={goToNextPage} style={styles.nextButton}>
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  pagerView: { flex: 1 },
  page: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 180, // Sesuaikan padding bawah jika diperlukan
  },
  pageHeader: {
    position: 'absolute',
    top: 20,
    left: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
  },
  dotContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: '#5c8d5c',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
  // authButtonsWrapper, registerButton, loginButton, authButtonText dihapus dari styles
  bottomNavigation: {
    position: 'absolute', // Gunakan posisi absolut untuk menempatkan di bawah
    bottom: 30, // Jarak dari bawah
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  leftButtonsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipButton: {
    marginRight: 10,
  },
  prevButton: {},
  navText: {
    fontSize: 16,
    color: '#666',
  },
  nextButton: {
    backgroundColor: '#5c8d5c',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
