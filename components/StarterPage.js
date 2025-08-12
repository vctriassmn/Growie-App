// Lokasi file: app/StarterPage.js (atau app/index.js jika ini halaman awal)

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
  },
  {
    image: require('../assets/images/Start1.png'),
    title: 'Meet Growie,\nYour gentle plant care buddy',
    description: 'We help you care for your plants—one friendly reminder at a time.',
  },
  {
    image: require('../assets/images/Start2.png'),
    title: 'Stay on Track\nWatering, sunlight & more',
    description: 'Growie sends smart reminders tailored to your plant’s needs.',
  },
  {
    image: require('../assets/images/Start3.png'),
    title: 'Grow with Confidence\nSee your greens flourish',
    description: 'Your plants, your schedule. Growie keeps it simple and joyful.',
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

  // --- PERBAIKAN DI SINI ---
  // Arahkan 'Skip' ke halaman Login agar konsisten dengan akhir onboarding
  const skipOnboarding = () => {
    router.replace('/Login');
  };

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

            <View style={styles.bottomNavigation}>
              <View style={styles.leftButtonsWrapper}>
                {/* Tombol Skip hanya muncul di halaman 2 */}
                {index === 1 && (
                  <TouchableOpacity onPress={skipOnboarding} style={styles.skipButton}>
                    <Text style={styles.navText}>Skip</Text>
                  </TouchableOpacity>
                )}
                {/* Tombol Prev muncul dari halaman 3 dan seterusnya */}
                {index >= 2 && (
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
    paddingTop: 150,
    paddingHorizontal: 20,
    paddingBottom: 200,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
    fontFamily: 'Nunito-Black',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
    fontFamily: 'Nunito-Regular',
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
    backgroundColor: '#448461',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 30,
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
    fontFamily: 'Nunito-SemiBold',
  },
  nextButton: {
    backgroundColor: '#448461',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Nunito-SemiBold',
  },
});