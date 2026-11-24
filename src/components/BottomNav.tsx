import { usePathname, useRouter } from 'expo-router';
import { Bookmark, Download, House, Search, UserRound } from 'lucide-react-native';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  // Design Reference Colors
  const ACTIVE_COLOR = '#F00032';
  const INACTIVE_COLOR = '#A1A5B5';
  const ICON_SIZE = 27;

  return (
    <View style={styles.navContainer}>
      
      {/* 1. HOME */}
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
        <House color={pathname === '/home' ? ACTIVE_COLOR : INACTIVE_COLOR} size={ICON_SIZE} strokeWidth={pathname === '/home' ? 2.5 : 2} />
        <Text style={[styles.navLabel, { color: pathname === '/home' ? ACTIVE_COLOR : INACTIVE_COLOR }]}>Home</Text>
      </TouchableOpacity>

      {/* 2. SEARCH */}
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/search')}>
        <Search color={pathname === '/search' ? ACTIVE_COLOR : INACTIVE_COLOR} size={ICON_SIZE} strokeWidth={pathname === '/search' ? 2.5 : 2} />
        <Text style={[styles.navLabel, { color: pathname === '/search' ? ACTIVE_COLOR : INACTIVE_COLOR }]}>Search</Text>
      </TouchableOpacity>

      {/* 3. SAVED */}
      <TouchableOpacity style={styles.navItem} onPress={() => router.push({ pathname: '/saved', params: { type: 'favorites' } })}>
        <Bookmark color={pathname === '/saved' ? ACTIVE_COLOR : INACTIVE_COLOR} size={ICON_SIZE} strokeWidth={pathname === '/saved' ? 2.5 : 2} />
        <Text style={[styles.navLabel, { color: pathname === '/saved' ? ACTIVE_COLOR : INACTIVE_COLOR }]}>Saved</Text>
      </TouchableOpacity>

      {/* 4. DOWNLOADS */}
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/downloads')}>
        <Download color={pathname === '/downloads' ? ACTIVE_COLOR : INACTIVE_COLOR} size={ICON_SIZE} strokeWidth={pathname === '/downloads' ? 2.5 : 2} />
        <Text style={[styles.navLabel, { color: pathname === '/downloads' ? ACTIVE_COLOR : INACTIVE_COLOR }]}>Downloads</Text>
      </TouchableOpacity>

      {/* 5. ME (PROFILE) */}
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
        <UserRound color={pathname === '/profile' ? ACTIVE_COLOR : INACTIVE_COLOR} size={ICON_SIZE} strokeWidth={pathname === '/profile' ? 2.5 : 2} />
        <Text style={[styles.navLabel, { color: pathname === '/profile' ? ACTIVE_COLOR : INACTIVE_COLOR }]}>Me</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20, // Safe area spacing for iOS and Android
    left: 20,
    right: 20,
    backgroundColor: '#0D1020', // Deep navy/black
    borderRadius: 35, // Rounded capsule shape
    borderWidth: 1,
    borderColor: '#303548', // Thin elegant border
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    // Subtle red glow and shadow
    shadowColor: '#F00032',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10, // Android shadow
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
});