import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants'; // 👈 Added for dynamic version
import { useFocusEffect, useRouter } from 'expo-router';
import { Bookmark, Clock, Download, Heart, Info, LogIn, Moon, Pencil, Share2, Smartphone, Trash2, User } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Share, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import InstallModal from '../components/InstallModal';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  
  // 👈 Dynamic version from app.json
  const appVersion = Constants.expoConfig?.version || '1.0.1';
  
  const [userName, setUserName] = useState('Guest User');
  const [userEmail, setUserEmail] = useState('Tap to sign up');
  const [cacheSize, setCacheSize] = useState('0B');
  
  // Stats States
  const [favCount, setFavCount] = useState(0);
  const [downloadCount, setDownloadCount] = useState(0);

  // State for Install Modal
  const [showInstallModal, setShowInstallModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Load User Info
      AsyncStorage.getItem('@user_name').then(name => { if (name) setUserName(name); });
      AsyncStorage.getItem('@user_email').then(email => { if (email) setUserEmail(email); });
      
      // Load Stats
      AsyncStorage.getItem('@my_favorites').then(data => setFavCount(data ? JSON.parse(data).length : 0));
      AsyncStorage.getItem('@my_downloads').then(data => setDownloadCount(data ? JSON.parse(data).length : 0));
      
      // Load Cache size
      AsyncStorage.getAllKeys().then(keys => {
        if (keys.length > 2) setCacheSize('12.4 MB'); else setCacheSize('0B');
      });
    }, [])
  );

  const handleClearCache = async () => {
    Alert.alert("Clear Caches", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: async () => {
          await AsyncStorage.clear();
          setCacheSize('0B');
          setFavCount(0);
          setDownloadCount(0);
          setUserName('Guest User');
          setUserEmail('Tap to sign up');
          Alert.alert("Success", "All caches cleared.");
      }}
    ]);
  };

  const handleShareApp = async () => { try { await Share.share({ message: 'Check out CineVault! 🎬' }); } catch (error) {} };

  const MenuRow = ({ Icon, title, value, onPress, isLast, isSwitch, switchValue, onSwitchChange }: any) => (
    <TouchableOpacity style={[styles.menuRow, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.subText + '33' }]} onPress={onPress} disabled={isSwitch}>
      <View style={styles.menuLeft}>
        <View style={styles.iconContainer}>
          <Icon color={colors.text} size={22} strokeWidth={2} />
        </View>
        <Text style={[styles.menuTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={styles.menuRight}>
        {value && <Text style={[styles.menuValue, { color: colors.subText }]}>{value}</Text>}
        {isSwitch ? (
          <Switch value={switchValue} onValueChange={onSwitchChange} trackColor={{ true: colors.primary }} />
        ) : (
          <Text style={[styles.chevron, { color: colors.subText }]}>›</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>Profile</Text>

        <TouchableOpacity 
          style={[styles.headerCard, { backgroundColor: isDarkMode ? '#3a1012' : '#ffe5e5' }]} 
          onPress={() => router.push('/edit-profile')}
          activeOpacity={0.8}
        >
          <View style={[styles.avatarCircle, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#ff3b30' }]}>
            <User color="#fff" size={32} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerName, { color: colors.text }]}>{userName}</Text>
            <Text style={[styles.headerSub, { color: colors.subText }]}>{userEmail}</Text>
          </View>
          <View style={[styles.editBadge, { backgroundColor: colors.card }]}>
            <Pencil color={colors.text} size={16} />
          </View>
        </TouchableOpacity>

        <View style={[styles.statsRow, { backgroundColor: colors.card }]}>
          <View style={styles.statBox}>
            <Heart color={colors.primary} size={24} fill={colors.primary} />
            <Text style={[styles.statNumber, { color: colors.text }]}>{favCount}</Text>
            <Text style={[styles.statLabel, { color: colors.subText }]}>Favorites</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.subText + '33' }]} />
          <View style={styles.statBox}>
            <Download color={colors.primary} size={24} />
            <Text style={[styles.statNumber, { color: colors.text }]}>{downloadCount}</Text>
            <Text style={[styles.statLabel, { color: colors.subText }]}>Downloads</Text>
          </View>
        </View>

        <View style={[styles.menuGroup, { backgroundColor: colors.card }]}>
          <MenuRow Icon={Clock} title="Watch History" onPress={() => router.push('/history')} />
          <MenuRow Icon={Heart} title="Watchlist" onPress={() => router.push({ pathname: '/saved', params: { type: 'watchlist' } })} />
          <MenuRow Icon={Bookmark} title="My Favourite" onPress={() => router.push({ pathname: '/saved', params: { type: 'favorites' } })} isLast />
        </View>

        <View style={[styles.menuGroup, { backgroundColor: colors.card }]}>
          <MenuRow Icon={Smartphone} title="Install App" onPress={() => setShowInstallModal(true)} />
          <MenuRow Icon={Moon} title="Dark Mode" isSwitch switchValue={isDarkMode} onSwitchChange={toggleTheme} />
          <MenuRow Icon={Trash2} title="Clear Caches" value={cacheSize} onPress={handleClearCache} />
          <MenuRow Icon={Share2} title="Share App" onPress={handleShareApp} />
          <MenuRow Icon={Info} title="About Us" onPress={() => Alert.alert("About", "CineVault v1.0.1\nBuilt with React Native & TMDB")} />
          <MenuRow Icon={LogIn} title="Sign Up / Log In" onPress={() => Alert.alert("Coming Soon 🚀", "Sign in will be available soon!")} isLast />
        </View>

        {/* 👇 Dynamic Version Number 👇 */}
        <Text style={[styles.footerText, { color: colors.subText }]}>
          CineVault App • Version {appVersion}
        </Text>

      </ScrollView>
      <BottomNav />

      <InstallModal 
        visible={showInstallModal} 
        onClose={() => setShowInstallModal(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 },
  
  // Header Card
  headerCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#5a1a1d', marginBottom: 20 },
  avatarCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  headerTextContainer: { flex: 1 },
  headerName: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  headerSub: { fontSize: 13 },
  editBadge: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },

  // Stats Row
  statsRow: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 16, paddingVertical: 15, marginBottom: 20, alignItems: 'center' },
  statBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statDivider: { width: 1, height: '70%' },
  statNumber: { fontSize: 20, fontWeight: 'bold', marginTop: 5, marginBottom: 2 },
  statLabel: { fontSize: 12, fontWeight: '600' },

  // Menus
  menuGroup: { marginHorizontal: 20, borderRadius: 16, marginBottom: 20, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18, paddingHorizontal: 20 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { marginRight: 15, width: 24, alignItems: 'center' },
  menuTitle: { fontSize: 16, fontWeight: '500' },
  menuRight: { flexDirection: 'row', alignItems: 'center' },
  menuValue: { fontSize: 14, marginRight: 10 },
  chevron: { fontSize: 22, fontWeight: '300', marginTop: -2 },

  // Footer
  footerText: { textAlign: 'center', fontSize: 12, marginTop: 10, marginBottom: 30 }
});