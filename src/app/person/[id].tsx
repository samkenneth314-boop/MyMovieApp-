import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native'; // 👈 ICON
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MovieCard from '../../components/MovieCard';
import { useTheme } from '../../context/ThemeContext';

const API_KEY = '2a8be055490d46c1bd52f6befac96d9d';

export default function ActorScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const [person, setPerson] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en-US`).then(res => res.json()),
      fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${API_KEY}&language=en-US`).then(res => res.json())
    ]).then(([personData, creditsData]) => {
      setPerson(personData);
      const sortedMovies = creditsData.cast
        ?.sort((a: any, b: any) => b.popularity - a.popularity)
        .filter((v: any, i: any, a: any) => a.findIndex((t: any) => t.id === v.id) === i) || [];
      setMovies(sortedMovies.slice(0, 20)); 
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (!person) return <View style={[styles.center, { backgroundColor: colors.background }]}><Text style={{color: colors.text}}>Actor not found</Text></View>;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.card }]} onPress={() => router.back()}>
        <ArrowLeft color={colors.text} size={18} />
        <Text style={{ color: colors.text, fontWeight: 'bold', marginLeft: 5 }}>Back</Text>
      </TouchableOpacity>

      <View style={styles.profileHeader}>
        {person.profile_path ? (
          <Image source={{ uri: `https://image.tmdb.org/t/p/w300${person.profile_path}` }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: '#333' }]} />
        )}
        <Text style={[styles.name, { color: colors.text }]}>{person.name}</Text>
        <Text style={[styles.subInfo, { color: colors.subText }]}>{person.known_for_department} • {person.birthday || 'Unknown Birthday'}</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Biography</Text>
        <Text style={[styles.biography, { color: colors.subText }]}>{person.biography || 'No biography available.'}</Text>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 25 }]}>Known For</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MovieCard 
              item={item} 
              onPress={() => router.push({ pathname: '/movie/[id]', params: { id: item.id } })} 
            />
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 10, flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  profileHeader: { alignItems: 'center', marginTop: 100, marginBottom: 20 },
  avatar: { width: 150, height: 150, borderRadius: 75, marginBottom: 15 },
  name: { fontSize: 28, fontWeight: 'bold' },
  subInfo: { fontSize: 14, marginTop: 5 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  biography: { fontSize: 15, lineHeight: 22 },
});