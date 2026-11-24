import { Link, usePathname } from 'expo-router'; // 👈 1. Import Link instead of useRouter
import { Bookmark, Download, House, Search, UserRound } from 'lucide-react-native';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BottomNav() {
  const pathname = usePathname();

  // Design Reference Colors
  const ACTIVE_COLOR = '#F00032';
  const INACTIVE_COLOR = '#A1A5B5';
  const ICON_SIZE = 27;

  return (
    <View style={styles.navContainer}>
      
      {/* 1. HOME */}
      <Link href="/home" asChild>
        <TouchableOpacity style={styles.navItem}>
          <House color={pathname === '/home' ? ACTIVE_COLOR : INACTIVE_COLOR} size={ICON_SIZE} strokeWidth={pathname === '/home' ? 2.5 : 2} />
          <Text style={[styles.navLabel, { color: pathname === '/home' ? ACTIVE_COLOR : INACTIVE_COLOR }]}>Home</Text>
        </TouchableOpacity>
      </Link>

      {/* 2. SEARCH */}
      <Link href="/search" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Search color={pathname === '/search' ? ACTIVE_COLOR : INACTIVE_COLOR} size={ICON_SIZE} strokeWidth={pathname === '/search' ? 2.5 : 2} />
          <Text style={[styles.navLabel, { color: pathname === '/search' ? ACTIVE_COLOR : INACTIVE_COLOR }]}>Search</Text>
        </TouchableOpacity>
      </Link>

      {/* 3. SAVED */}
      <Link href={{ pathname: '/saved', params: { type: 'favorites' } }} asChild>
        <TouchableOpacity style={styles.navItem}>
          <Bookmark color={pathname === '/saved' ? ACTIVE_COLOR : INACTIVE_COLOR} size={ICON_SIZE} strokeWidth={pathname === '/saved' ? 2.5 : 2} />
          <Text style={[styles.navLabel, { color: pathname === '/saved' ? ACTIVE_COLOR : INACTIVE_COLOR }]}>Saved</Text>
        </TouchableOpacity>
      </Link>

      {/* 4. DOWNLOADS */}
      <Link href="/downloads" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Download color={pathname === '/downloads' ? ACTIVE_COLOR : INACTIVE_COLOR} size={ICON_SIZE} strokeWidth={pathname === '/downloads' ? 2.5 : 2} />
          <Text style={[styles.navLabel, { color: pathname === '/downloads' ? ACTIVE_COLOR : INACTIVE_COLOR }]}>Downloads</Text>
        </TouchableOpacity>
      </Link>

      {/* 5. ME (PROFILE) */}
      <Link href="/profile" asChild>
        <TouchableOpacity style={styles.navItem}>
          <UserRound color={pathname === '/profile' ? ACTIVE_COLOR : INACTIVE_COLOR} size={ICON_SIZE} strokeWidth={pathname === '/profile' ? 2.5 : 2} />
          <Text style={[styles.navLabel, { color: pathname === '/profile' ? ACTIVE_COLOR : INACTIVE_COLOR }]}>Me</Text>
        </TouchableOpacity>
      </Link>

    </View>
  );
}

// ... styles remain EXACTLY the same ...
const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 20,
    right: 20,
    backgroundColor: '#0D1020',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#303548',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    shadowColor: '#F00032',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
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