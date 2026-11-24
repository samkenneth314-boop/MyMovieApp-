import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SearchMovieCard from '../components/SearchMovieCard';
import { ShimmerGrid } from '../components/Shimmer';
import { useTheme } from '../context/ThemeContext';

const API_KEY = '2a8be055490d46c1bd52f6befac96d9d'; 

// 👇 "All" is back at the front of the list
const TYPES = [
  { id: 'all', name: 'All' },
  { id: 'movie', name: 'Movies' }, 
  { id: 'tv', name: 'TV Series' },
  { id: 'anime', name: 'Anime' } 
];

const SORTS = [{ id: 'popularity.desc', name: 'Popular' }, { id: 'vote_average.desc', name: 'Rated' }, { id: 'primary_release_date.desc', name: 'Release' }];
const GENRES = [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' }, { id: 27, name: 'Horror' }];
const YEARS = [2026, 2025, 2024, 2023, 2022, 2021];

export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  
  const [query, setQuery] = useState('');
  const [type, setType] = useState('movie'); // Default to Movies
  const [sort, setSort] = useState('popularity.desc');
  const [genre, setGenre] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setPage(1);
    fetchResults(1);
  }, [query, type, sort, genre, year]);

  const fetchResults = (pageNum: number) => {
    let url = '';

    // 👇 1. SPECIAL LOGIC FOR "ALL" (Combines Movies + TV)
    if (type === 'all') {
      if (query.trim().length > 0) {
        // If searching, use multi-search
        url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}&language=en-US&page=${pageNum}`;
      } else if (genre || year) {
        // If filtering by year/genre, we have to fetch BOTH movies and TV shows and merge them
        let movieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=${sort}&page=${pageNum}`;
        let tvUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&sort_by=${sort}&page=${pageNum}`;
        
        if (genre) { movieUrl += `&with_genres=${genre}`; tvUrl += `&with_genres=${genre}`; }
        if (year) { movieUrl += `&primary_release_year=${year}`; tvUrl += `&first_air_date_year=${year}`; }

        // Fetch both at the same time
        Promise.all([fetch(movieUrl).then(r => r.json()), fetch(tvUrl).then(r => r.json())])
          .then(([movieData, tvData]) => {
            const movies = (movieData.results || []).map((m: any) => ({ ...m, media_type: 'movie' }));
            const tvShows = (tvData.results || []).map((t: any) => ({ ...t, media_type: 'tv' }));
            
            // Combine and sort by popularity
            let combined = [...movies, ...tvShows].sort((a, b) => b.popularity - a.popularity);
            
            if (pageNum === 1) { setResults(combined); setLoading(false); } 
            else { setResults(prev => [...prev, ...combined]); setLoadingMore(false); }
          })
          .catch(() => { setLoading(false); setLoadingMore(false); });
        return; // Stop here so it doesn't run the code below
      } else {
        // Default 'All' view (Trending)
        url = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&page=${pageNum}`;
      }
    } 
    // 👇 2. LOGIC FOR ANIME
    else if (type === 'anime') {
      if (query.trim().length > 0) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&language=en-US&page=${pageNum}`;
      } else {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=${sort}&page=${pageNum}&with_genres=16&with_original_language=ja`;
        if (year) url += `&primary_release_year=${year}`;
      }
    } 
    // 👇 3. STANDARD LOGIC FOR MOVIES & TV
    else if (query.trim().length > 0) {
      url = `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${query}&language=en-US&page=${pageNum}`;
    } else {
      url = `https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&language=en-US&sort_by=${sort}&page=${pageNum}`;
      if (genre) url += `&with_genres=${genre}`;
      if (year && type === 'movie') url += `&primary_release_year=${year}`;
      if (year && type === 'tv') url += `&first_air_date_year=${year}`;
    }

    // Fetch data for single endpoints
    const delayDebounceFn = setTimeout(() => {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (pageNum === 1) { setResults(data.results || []); setLoading(false); } 
          else { setResults(prev => [...prev, ...(data.results || [])]); setLoadingMore(false); }
        })
        .catch(err => { setLoading(false); setLoadingMore(false); });
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  };

  const loadMore = () => {
    if (loadingMore || loading) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchResults(nextPage);
  };

  const renderPill = (label: any, isActive: boolean, onPress: () => void) => (
    <TouchableOpacity key={label.toString()} style={[styles.pill, { backgroundColor: colors.card }, isActive && { backgroundColor: colors.primary }]} onPress={onPress}>
      <Text style={[styles.pillText, { color: colors.subText }, isActive && { color: '#fff' }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Search</Text>
        <TextInput style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text }]} placeholder="Search..." placeholderTextColor={colors.subText} value={query} onChangeText={setQuery} />
      </View>

      {loading ? (
        <ShimmerGrid />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={3}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => loadingMore ? <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} /> : null}
          
          ListHeaderComponent={
            <View style={{ marginBottom: 20 }}>
              {/* Row 1: Types (All, Movies, TV, Anime) */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                {TYPES.map(t => renderPill(t.name, type === t.id, () => setType(t.id)))}
              </ScrollView>

              {/* Row 2: Sort */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                {SORTS.map(s => renderPill(s.name, sort === s.id, () => setSort(s.id)))}
              </ScrollView>

              {/* Row 3: Genres */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                {renderPill('All', !genre, () => setGenre(null))}
                {GENRES.map(g => renderPill(g.name, genre === g.id, () => setGenre(g.id)))}
              </ScrollView>

              {/* Row 4: Years */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                {renderPill('All', !year, () => setYear(null))}
                {YEARS.map(y => renderPill(y.toString(), year === y, () => setYear(y)))}
              </ScrollView>
            </View>
          }
          ListEmptyComponent={() => <Text style={[styles.noResults, { color: colors.subText }]}>No results found.</Text>}
          
          renderItem={({ item }) => (
            <SearchMovieCard 
              item={item} 
              onPress={() => router.push({ 
                pathname: '/movie/[id]', 
                // 👇 Smart routing: Knows if it's a movie or tv show based on the media_type
                params: { id: item.id, type: type === 'all' ? (item.media_type || 'movie') : (type === 'anime' ? 'movie' : type) } 
              })} 
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 60, paddingBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 15 },
  searchInput: { borderRadius: 10, paddingHorizontal: 15, height: 50, fontSize: 16 },
  filterRow: { paddingTop: 15, flexDirection: 'row' },
  pill: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, marginRight: 10 },
  pillText: { fontSize: 14, fontWeight: '500' },
  row: { justifyContent: 'flex-start', gap: 10 },
  noResults: { textAlign: 'center', marginTop: 30, fontSize: 16, width: '100%' },
});