import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MovieCard from '../components/MovieCard';
import { useTheme } from '../context/ThemeContext';

const API_KEY = '2a8be055490d46c1bd52f6befac96d9d';

export default function CategoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { title, genreId, type } = useLocalSearchParams(); 
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchMovies(1);
  }, [genreId, type]);

  const fetchMovies = (pageNum: number) => {
    let url = '';
    
    // 👇 ADDED TV POPULAR AND TV AIRING ROUTES 👇
    if (type === 'tv_popular') {
      url = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=${pageNum}`;
    } else if (type === 'tv_airing') {
      url = `https://api.themoviedb.org/3/tv/airing_today?api_key=${API_KEY}&language=en-US&page=${pageNum}`;
    } else if (genreId) {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US&page=${pageNum}`;
    } else if (type === 'popular') {
      url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${pageNum}`;
    } else if (type === 'top_rated') {
      url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${pageNum}`;
    } else if (type === 'upcoming') {
      url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${pageNum}`;
    } else if (type === 'trending') {
      url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&page=${pageNum}`;
    } else if (type === 'now_playing') {
      url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${pageNum}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (pageNum === 1) {
          setMovies(data.results || []);
          setLoading(false);
        } else {
          setMovies(prev => [...prev, ...(data.results || [])]);
          setLoadingMore(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setLoadingMore(false);
      });
  };

  const loadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(nextPage);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <ArrowLeft color={colors.text} size={18} />
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold', marginLeft: 5 }}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{title || 'Movies'}</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => loadingMore ? <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} /> : null}
          renderItem={({ item }) => (
            <MovieCard 
              item={item} 
              // 👇 ROUTING FIX FOR TV SHOWS 👇
              onPress={() => router.push({ 
                pathname: '/movie/[id]', 
                params: { id: item.id, type: (type === 'tv_popular' || type === 'tv_airing') ? 'tv' : 'movie' } 
              })} 
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingBottom: 20 },
  backBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginRight: 15 },
  title: { fontSize: 24, fontWeight: 'bold' },
  row: { justifyContent: 'space-between' },
});