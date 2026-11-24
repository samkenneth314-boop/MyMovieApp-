import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native'; // 👈 ICON
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import SearchMovieCard from '../components/SearchMovieCard';
import { useTheme } from '../context/ThemeContext';

export default function HistoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('@watch_history').then(saved => {
        setMovies(saved ? JSON.parse(saved) : []);
        setLoading(false);
      });
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/profile')} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <ArrowLeft color={colors.text} size={18} />
          <Text style={{ color: colors.text, fontWeight: 'bold', marginLeft: 5 }}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Watch History</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : movies.length === 0 ? (
        <Text style={[styles.empty, { color: colors.subText }]}>You haven't watched anything yet.</Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <SearchMovieCard 
              item={item} 
              onPress={() => router.push({ pathname: '/movie/[id]', params: { id: item.id, type: item.media_type || 'movie' } })} 
            />
          )}
        />
      )}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingBottom: 20 },
  backBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginRight: 15 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  row: { justifyContent: 'flex-start', gap: 10 },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16 },
});