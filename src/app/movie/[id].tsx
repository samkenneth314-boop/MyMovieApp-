import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, Calendar, Film, Heart, MonitorPlay, Play, Star, Tv } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from '../../components/Toast';
import { useTheme } from '../../context/ThemeContext';

const API_KEY = '2a8be055490d46c1bd52f6befac96d9d'; 
const { width } = Dimensions.get('window');

export default function MediaDetails() {
  const { id, type = 'movie' } = useLocalSearchParams(); 
  const router = useRouter();
  const { colors } = useTheme(); 
  
  const [media, setMedia] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  
  const [seasons, setSeasons] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const isMovie = type === 'movie';

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
  };

  useEffect(() => {
    Promise.all([
      fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=en-US`).then(res => res.json()),
      fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${API_KEY}`).then(res => res.json()),
      fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`).then(res => res.json()),
      fetch(`https://api.themoviedb.org/3/${type}/${id}/reviews?api_key=${API_KEY}&language=en-US&page=1`).then(res => res.json())
    ]).then(([mediaData, creditsData, videoData, reviewData]) => {
      setMedia(mediaData);
      setCast(creditsData.cast?.slice(0, 10) || []);
      setReviews(reviewData.results?.slice(0, 3) || []); 
      
      const trailer = videoData.results?.find((vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube');
      if (trailer) setTrailerKey(trailer.key);

      if (!isMovie && mediaData.seasons) {
        const validSeasons = mediaData.seasons.filter((s: any) => s.season_number > 0);
        setSeasons(validSeasons);
        if (validSeasons.length > 0) {
          fetchEpisodes(validSeasons[0].season_number);
        }
      }
      checkStorageStatus(mediaData.id);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id, type]);

  const fetchEpisodes = (seasonNum: number) => {
    setSelectedSeason(seasonNum);
    setLoadingEpisodes(true);
    fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNum}?api_key=${API_KEY}&language=en-US`)
      .then(res => res.json())
      .then(data => {
        setEpisodes(data.episodes || []);
        setLoadingEpisodes(false);
      });
  };

  const checkStorageStatus = async (mediaId: number) => {
    try {
      const favs = await AsyncStorage.getItem('@my_favorites');
      if (favs && JSON.parse(favs).some((f: any) => f.id === mediaId)) setIsFavorite(true);
      const watch = await AsyncStorage.getItem('@my_watchlist');
      if (watch && JSON.parse(watch).some((w: any) => w.id === mediaId)) setIsWatchlisted(true);
    } catch (error) { console.log(error); }
  };

  const toggleFavorite = async () => {
    try {
      const savedJson = await AsyncStorage.getItem('@my_favorites');
      let saved = savedJson ? JSON.parse(savedJson) : [];
      if (isFavorite) {
        saved = saved.filter((fav: any) => fav.id !== media.id);
        setIsFavorite(false);
        showToast('Removed from Favorites');
      } else {
        saved.push({ ...media, media_type: type }); 
        setIsFavorite(true);
        showToast('Added to Favorites');
      }
      await AsyncStorage.setItem('@my_favorites', JSON.stringify(saved));
    } catch (error) { console.log(error); }
  };

  const toggleWatchlist = async () => {
    try {
      const savedJson = await AsyncStorage.getItem('@my_watchlist');
      let saved = savedJson ? JSON.parse(savedJson) : [];
      if (isWatchlisted) {
        saved = saved.filter((item: any) => item.id !== media.id);
        setIsWatchlisted(false);
        showToast('Removed from Watchlist');
      } else {
        saved.push({ ...media, media_type: type }); 
        setIsWatchlisted(true);
        showToast('Added to Watchlist');
      }
      await AsyncStorage.setItem('@my_watchlist', JSON.stringify(saved));
    } catch (error) { console.log(error); }
  };

  const handlePlayTrailer = () => {
    if (trailerKey) router.push({ pathname: '/movie/player', params: { youtubeId: trailerKey, title: media.title || media.name } });
  };

  // 👇 UPDATED TO USE VIDSRC.TO AND SAVE WATCH HISTORY 👇
  const handlePlayFullMovie = async (seasonNum?: number, epNum?: number) => {
    try {
      // 1. Save to Watch History
      const historyJson = await AsyncStorage.getItem('@watch_history');
      let history = historyJson ? JSON.parse(historyJson) : [];
      
      // Remove if it already exists so we can move it to the top
      history = history.filter((h: any) => h.id !== media.id);
      
      // Add new item to the top with timestamp
      history.unshift({ ...media, media_type: type, watchedAt: Date.now() });
      
      // Keep only the last 20 items
      history = history.slice(0, 20);
      
      await AsyncStorage.setItem('@watch_history', JSON.stringify(history));

      // 2. Build URL using VidSrc.to and navigate
      let url = '';
      if (type === 'tv' && seasonNum && epNum) {
        url = `https://vidsrc.to/embed/tv/${media.id}/${seasonNum}/${epNum}`;
      } else {
        url = `https://vidsrc.to/embed/movie/${media.id}`;
      }

      router.push({ 
        pathname: '/movie/player', 
        params: {
          videoUrl: url,
          id: String(media.id),
          type: String(type),
          season: seasonNum ? String(seasonNum) : '',
          episode: epNum ? String(epNum) : '',
          title: media.title || media.name,
        } 
      });
    } catch (error) {
      console.error("Error saving history:", error);
    }
  };

  if (loading || !media) return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Toast message={toastMsg} visible={toastVisible} onHide={() => setToastVisible(false)} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
        
        <View style={styles.headerContainer}>
          <Image source={{ uri: `https://image.tmdb.org/t/p/w780${media.backdrop_path}` }} style={styles.backdrop} />
          
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 15 }}>
              <TouchableOpacity style={styles.iconCircle} onPress={toggleWatchlist}>
                <Bookmark color={isWatchlisted ? colors.primary : '#fff'} size={22} fill={isWatchlisted ? colors.primary : 'none'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircle} onPress={toggleFavorite}>
                <Heart color={isFavorite ? colors.primary : '#fff'} size={22} fill={isFavorite ? colors.primary : 'none'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>{media.title || media.name}</Text>
          
          <View style={styles.row}>
            <View style={styles.metaItem}>
              <Star color="#FFD700" size={16} fill="#FFD700" />
              <Text style={[styles.metaText, { color: colors.text }]}>{media.vote_average?.toFixed(1)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Calendar color={colors.subText} size={16} />
              <Text style={[styles.metaText, { color: colors.subText }]}>{(media.release_date || media.first_air_date)?.split('-')[0]}</Text>
            </View>
            <View style={styles.metaItem}>
              {isMovie ? <Film color={colors.subText} size={16} /> : <Tv color={colors.subText} size={16} />}
              <Text style={[styles.metaText, { color: colors.subText }]}>{isMovie ? 'Movie' : 'TV Show'}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.playButton, { backgroundColor: '#1DB954' }]} 
            onPress={() => handlePlayFullMovie(selectedSeason, 1)}
          >
            <MonitorPlay color="#fff" size={20} />
            <Text style={styles.buttonText}>Watch Full Movie</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.playButton, { backgroundColor: colors.primary }]} onPress={handlePlayTrailer}>
            <Play color="#fff" size={20} fill="#fff" />
            <Text style={styles.buttonText}>Watch Trailer</Text>
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Storyline</Text>
          <Text style={[styles.overview, { color: colors.subText }]}>{media.overview || 'No description available.'}</Text>

          {!isMovie && seasons.length > 0 && (
            <View style={{ marginBottom: 30 }}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Seasons ({seasons.length})</Text>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                {seasons.map((s: any) => (
                  <TouchableOpacity 
                    key={s.id} 
                    style={[styles.pill, { backgroundColor: colors.card }, selectedSeason === s.season_number && { backgroundColor: colors.primary }]}
                    onPress={() => fetchEpisodes(s.season_number)}
                  >
                    <Text style={[styles.pillText, { color: colors.subText }, selectedSeason === s.season_number && { color: '#fff', fontWeight: 'bold' }]}>
                      Season {s.season_number}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {loadingEpisodes ? <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} /> : (
                episodes.map((ep: any) => (
                  <TouchableOpacity 
                    key={ep.id} 
                    style={[styles.episodeCard, { backgroundColor: colors.card }]}
                    onPress={() => handlePlayFullMovie(selectedSeason, ep.episode_number)}
                    activeOpacity={0.7}
                  >
                    {ep.still_path ? <Image source={{ uri: `https://image.tmdb.org/t/p/w300${ep.still_path}` }} style={styles.episodeImg} /> : <View style={styles.episodeImg} />}
                    <View style={styles.episodeInfo}>
                      <Text style={[styles.episodeTitle, { color: colors.text }]}>{ep.episode_number}. {ep.name}</Text>
                      <Text style={[styles.episodeOverview, { color: colors.subText }]} numberOfLines={2}>{ep.overview || 'No description.'}</Text>
                    </View>
                    <View style={styles.episodePlayIcon}>
                      <Play color="#1DB954" size={20} fill="#1DB954" />
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Cast</Text>
          <FlatList
            horizontal showsHorizontalScrollIndicator={false} data={cast} keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.castCard} onPress={() => router.push({ pathname: '/person/[id]', params: { id: item.id } })}>
                {item.profile_path ? <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.profile_path}` }} style={styles.castImg} /> : <View style={[styles.castImg, {backgroundColor:'#333'}]} />}
                <Text style={[styles.castName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: { position: 'relative', width: '100%', height: 350 },
  backdrop: { width: '100%', height: '100%' },
  topBar: { position: 'absolute', top: 60, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', zIndex: 10 },
  iconCircle: { backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 50 },
  content: { padding: 20, paddingTop: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 15, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 14, fontWeight: '500' },
  playButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 15, borderRadius: 10, marginBottom: 15 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  overview: { fontSize: 15, lineHeight: 22, marginBottom: 20 },
  pill: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, marginRight: 10 },
  pillText: { fontSize: 14, fontWeight: '500' },
  episodeCard: { flexDirection: 'row', borderRadius: 10, marginBottom: 10, overflow: 'hidden', alignItems: 'center' },
  episodeImg: { width: 120, height: 70, backgroundColor: '#333' },
  episodeInfo: { flex: 1, padding: 10, justifyContent: 'center' },
  episodeTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  episodeOverview: { fontSize: 11 },
  episodePlayIcon: { paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center' },
  castCard: { width: 80, marginRight: 15, alignItems: 'center' },
  castImg: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#222', marginBottom: 8 },
  castName: { fontSize: 12, textAlign: 'center' },
});