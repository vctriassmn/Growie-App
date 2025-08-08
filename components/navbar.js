import { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define icon paths for inactive and active states outside the component
const ICONS = {
    Home: {
        inactive: require('../assets/images/home.png'),
        active: require('../assets/images/home_active.png'),
    },
    Article: {
        inactive: require('../assets/images/arikel.png'),
        active: require('../assets/images/artikel_active.png'),
    },
    Reminder: {
        inactive: require('../assets/images/reminder.png'),
        active: require('../assets/images/reminder_active.png'),
    },
    Journal: {
        inactive: require('../assets/images/journal.png'),
        active: require('../assets/images/journal_active.png'),
    },
    'My garden': { // Kunci ini tetap 'My garden' karena itu nama file gambar
        inactive: require('../assets/images/mygarden.png'),
        active: require('../assets/images/mygarden_active.png'),
    },
};

const BottomNavBar = ({ navigation, currentRouteName }) => {
    const navItems = [
        // 'name' harus cocok dengan nama rute di _layout.js (nama file)
        // 'uiName' adalah teks yang ditampilkan di navbar
        { name: 'Home', uiName: 'Home', icon: ICONS.Home },
        { name: 'Article', uiName: 'Article', icon: ICONS.Article },
        { name: 'Reminder', uiName: 'Reminder', icon: ICONS.Reminder },
        { name: 'Journal', uiName: 'Journal', icon: ICONS.Journal },
        { name: 'MyGarden', uiName: 'My garden', icon: ICONS['My garden'] }, // 'MyGarden' untuk rute, 'My garden' untuk UI
    ];

    // Function to determine if a tab should be active
    const isTabActive = (tabName) => {
        // Direct match
        if (currentRouteName === tabName) {
            return true;
        }
        
        // Check for sub-pages of each tab
        switch (tabName) {
            case 'Reminder':
                return currentRouteName === 'AddReminder' || currentRouteName === 'EditReminder';
            case 'Article':
                return currentRouteName.includes('ArticleComponents');
            case 'Journal':
                return currentRouteName.includes('Journal/');
            case 'MyGarden':
                return currentRouteName.includes('plant/') || currentRouteName.includes('MyGarden/');
            default:
                return false;
        }
    };

    // Debug log to help troubleshoot
    console.log('Current Route Name:', currentRouteName);
    console.log('Is Reminder Active:', isTabActive('Reminder'));

    useEffect(() => {
        const preloadImages = async () => {
            const imageUris = [];
            navItems.forEach(item => {
                if (item.icon.inactive) {
                    imageUris.push(Image.resolveAssetSource(item.icon.inactive).uri);
                }
                if (item.icon.active) {
                    imageUris.push(Image.resolveAssetSource(item.icon.active).uri);
                }
            });

            try {
                await Promise.all(imageUris.map(uri => Image.prefetch(uri)));
                console.log('All navbar icons preloaded successfully!');
            } catch (error) {
                console.warn('Failed to preload some navbar icons:', error);
            }
        };

        preloadImages();
    }, []);

    const handlePress = (itemName) => {
        if (navigation) {
            // navigation.navigate() akan bekerja dengan nama rute (nama file)
            navigation.navigate(itemName);
        }
    };

    return (
        <View style={styles.navBarContainer}>
            {navItems.map((item) => {
                const isActive = isTabActive(item.name);
                
                return (
                    <TouchableOpacity
                        key={item.name} // Key harus unik, gunakan nama rute
                        style={styles.navItem}
                        onPress={() => handlePress(item.name)}
                    >
                        <View
                            style={[
                                styles.iconContainer,
                                // Use isTabActive function instead of direct comparison
                                isActive && styles.activeIconBackground,
                            ]}
                        >
                            <Image
                                source={isActive ? item.icon.active : item.icon.inactive}
                                style={styles.icon}
                            />
                        </View>
                        <Text
                            style={[
                                styles.navText,
                                isActive && styles.activeNavText,
                            ]}
                        >
                            {item.uiName} {/* Tampilkan uiName di teks navbar */}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    navBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        height: 90,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 10,
        paddingBottom: 15,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeIconBackground: {
        backgroundColor: 'rgba(127, 153, 94, 0.6)',
        borderRadius: 30,
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    navText: {
        fontSize: 10,
        marginTop: 4,
        color: '#888888',
        fontWeight: '500',
    },
    activeNavText: {
        color: '#7F995E',
        fontWeight: 'bold',
    },
});

export default BottomNavBar;
