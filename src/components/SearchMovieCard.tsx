import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 3; 

export default function SearchMovieCard({ item, onPress }: any) {
  const { colors } = useTheme();
  const imageUrl = item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : 'https://via.placeholder.com/100x150/333/fff?text=No+Image';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.poster} />
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</Text>
        </View>
      </View>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{item.title || item.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: CARD_WIDTH, marginBottom: 20 },
  imageContainer: { position: 'relative', width: '100%' },
  poster: { width: '100%', height: CARD_WIDTH * 1.5, borderRadius: 8, backgroundColor: '#222' },
  ratingBadge: { position: 'absolute', top: 6, left: 6, backgroundColor: '#ff3b30', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  ratingText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  title: { fontSize: 12, fontWeight: '600', marginTop: 8 },
});