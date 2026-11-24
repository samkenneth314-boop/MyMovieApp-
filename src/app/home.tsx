import { useRouter } from 'expo-router';
import { Bell, Info, Play, User } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import MovieRow from '../components/MovieRow';
import SearchMovieCard from '../components/SearchMovieCard';
import { ShimmerHome } from '../components/Shimmer';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const API_KEY = '2a8be055490d46c1bd52f6befac96d9d';

const CATEGORIES = [
  { name: 'All', id: null }, { name: 'Action', id: 28 }, { name: 'Comedy', id: 35 }, { name: 'Romance', id: 10749 }, { name: 'Thriller', id: 53 },
];

export default function Home() {
  const router = useRouter();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  
  // Movie States
  const [featured, setFeatured] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [nowPlaying, setNowPlaying] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [actionMovies, setActionMovies] = useState<any[]>([]);
  const [comedyMovies, setComedyMovies] = useState<any[]>([]);
  
  // 👇 NEW TV SHOW STATES 👇
  const [popularTV, setPopularTV] = useState<any[]>([]);
  const [airingTodayTV, setAiringTodayTV] = useState<any[]>([]);
  
  // Infinite Scroll States
  const [popular, setPopular] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    Promise.all([
      fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`).then(res => res.json()),
      fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`).then(res => res.json()),
      fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`).then(res => res.json()),
      fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`).then(res => res.json()),
      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28&language=en-US&page=1`).then(res => res.json()),
      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=35&language=en-US&page=1`).then(res => res.json()),
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`).then(res => res.json()),
      // 👇 FETCH TV SHOWS 👇
      fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`).then(res => res.json()),
      fetch(`https://api.themoviedb.org/3/tv/airing_today?api_key=${API_KEY}&language=en-US&page=1`).then(res => res.json())
    ]).then(([
      trendingData, topRatedData, nowPlayingData, upcomingData, 
      actionData, comedyData, popularData, popularTVData, airingTodayData
    ]) => {
      setFeatured(trendingData.results.slice(0, 5));
      setTrending(trendingData.results.slice(5, 20));
      setTopRated(topRatedData.results.slice(0, 15));
      setNowPlaying(nowPlayingData.results.slice(0, 15));
      setUpcoming(upcomingData.results.slice(0, 15));
      setActionMovies(actionData.results.slice(0, 15));
      setComedyMovies(comedyData.results.slice(0, 15));
      setPopular(popularData.results); 
      
      // 👇 SET TV SHOW DATA 👇
      setPopularTV(popularTVData.results.slice(0, 15));
      setAiringTodayTV(airingTodayData.results.slice(0, 15));
      
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (featured.length === 0) return;
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % featured.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, featured]);

  const loadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${nextPage}`)
      .then(res => res.json())
      .then(data => {
        setPopular(prev => [...prev, ...data.results]);
        setPage(nextPage);
        setLoadingMore(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingMore(false);
      });
  };

  const openMovie = (movie: any) => {
    router.push({ pathname: '/movie/[id]', params: { id: movie.id } });
  };

  // 👇 NEW: Function to open TV shows correctly 👇
  const openTVShow = (show: any) => {
    router.push({ pathname: '/movie/[id]', params: { id: show.id, type: 'tv' } });
  };

  if (loading || featured.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.text }]}>CINE<Text style={{color: '#ff3b30'}}>VAULT</Text></Text>
        </View>
        <ShimmerHome />
        <BottomNav />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={popular}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => loadingMore ? <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} /> : null}
        
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={[styles.logo, { color: colors.text }]}>CINE<Text style={{color: '#ff3b30'}}>VAULT</Text></Text>
              <View style={styles.headerIcons}>
                <TouchableOpacity onPress={() => Alert.alert("Notifications", "No new notifications")}>
                  <Bell color={colors.text} size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/profile')}>
                  <User color={colors.text} size={24} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.slideshowContainer}>
              <FlatList
                ref={flatListRef}
                data={featured}
                keyExtractor={(item) => item.id.toString()}
                horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(event.nativeEvent.contentOffset.x / width);
                  setActiveIndex(index);
                }}
                renderItem={({ item }) => (
                  <View style={{ width: width }}>
                    <View style={styles.featuredBanner}>
                      <Image source={{ uri: `https://image.tmdb.org/t/p/w780${item.backdrop_path}` }} style={styles.absoluteImage} />
                      <View style={styles.bannerOverlay}>
                        <Text style={styles.featuredTitle} numberOfLines={2}>{item.title || item.name}</Text>
                        <View style={styles.buttonRow}>
                          <TouchableOpacity style={styles.playButton} onPress={() => openMovie(item)}>
                            <Play color="#fff" size={18} fill="#fff" />
                            <Text style={styles.playText}>Play</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.infoButton} onPress={() => openMovie(item)}>
                            <Info color="#fff" size={18} />
                            <Text style={styles.infoText}>More Info</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              />
              <View style={styles.dotsContainer}>
                {featured.map((_, i) => (
                  <View key={i} style={[styles.dot, activeIndex === i && styles.activeDot]} />
                ))}
              </View>
            </View>

            <View style={styles.categoryContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {CATEGORIES.map((cat, index) => (
                  <TouchableOpacity 
                    key={index} style={[styles.categoryPill, { backgroundColor: colors.card }, index === 0 && styles.activePill]}
                    onPress={() => cat.id && router.push({ pathname: '/category', params: { title: cat.name, genreId: cat.id } })}
                  >
                    <Text style={[styles.categoryText, { color: colors.subText }, index === 0 && styles.activeCategoryText]}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Movie Rows */}
            <MovieRow title="Trending This Week" data={trending} onPressMovie={openMovie} onPressSeeAll={() => router.push({ pathname: '/category', params: { title: 'Trending', type: 'trending' } })} />
            <MovieRow title="Now Playing" data={nowPlaying} onPressMovie={openMovie} onPressSeeAll={() => router.push({ pathname: '/category', params: { title: 'Now Playing', type: 'now_playing' } })} />
            
            {/* 👇 NEW TV SHOW ROWS 👇 */}
            <MovieRow title="Popular TV Shows" data={popularTV} onPressMovie={openTVShow} onPressSeeAll={() => router.push({ pathname: '/category', params: { title: 'Popular TV Shows', type: 'tv_popular' } })} />
            <MovieRow title="Airing Today" data={airingTodayTV} onPressMovie={openTVShow} onPressSeeAll={() => router.push({ pathname: '/category', params: { title: 'Airing Today', type: 'tv_airing' } })} />
            
            <MovieRow title="Upcoming Movies" data={upcoming} onPressMovie={openMovie} onPressSeeAll={() => router.push({ pathname: '/category', params: { title: 'Upcoming', type: 'upcoming' } })} />
            <MovieRow title="Top Rated" data={topRated} onPressMovie={openMovie} onPressSeeAll={() => router.push({ pathname: '/category', params: { title: 'Top Rated', type: 'top_rated' } })} />
            <MovieRow title="Action Movies" data={actionMovies} onPressMovie={openMovie} onPressSeeAll={() => router.push({ pathname: '/category', params: { title: 'Action', genreId: 28 } })} />
            <MovieRow title="Comedy Movies" data={comedyMovies} onPressMovie={openMovie} onPressSeeAll={() => router.push({ pathname: '/category', params: { title: 'Comedy', genreId: 35 } })} />
            
            <Text style={[styles.sectionTitle, { color: colors.text, paddingHorizontal: 16, marginTop: 10 }]}>Popular Movies</Text>
          </View>
        }

        renderItem={({ item }) => (
          <SearchMovieCard item={item} onPress={() => openMovie(item)} />
        )}
      />
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 20 },
  logo: { fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  headerIcons: { flexDirection: 'row', gap: 15, alignItems: 'center' },
  slideshowContainer: { marginBottom: 20 },
  featuredBanner: { width: width - 32, height: 400, alignSelf: 'center', justifyContent: 'flex-end', marginHorizontal: 16, borderRadius: 20, overflow: 'hidden' },
  absoluteImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  bannerOverlay: { padding: 20, backgroundColor: 'rgba(0,0,0,0.4)' },
  featuredTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 15 },
  buttonRow: { flexDirection: 'row', gap: 15 },
  playButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ff3b30', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  playText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  infoButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  infoText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#333', marginHorizontal: 4 },
  activeDot: { backgroundColor: '#ff3b30', width: 20 },
  categoryContainer: { paddingHorizontal: 16, marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  categoryPill: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginRight: 10 },
  activePill: { backgroundColor: '#ff3b30' },
  categoryText: { fontSize: 14, fontWeight: '600' },
  activeCategoryText: { color: '#fff' },
  gridRow: { justifyContent: 'space-between', paddingHorizontal: 16, gap: 10, marginBottom: 15 },
});