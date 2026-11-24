import { Dimensions, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.32; 

export default function MovieCard({ item, onPress }: any) {
  const { colors } = useTheme();

  const imageUrl = item.poster_path 
    ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
    : 'https://via.placeholder.com/150x225/333/fff?text=No+Image';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: imageUrl }} style={styles.poster} />
      {/* 👇 ADDED item.name FOR TV SHOWS 👇 */}
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
        {item.title || item.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: CARD_WIDTH, marginBottom: 15, marginRight: 12 },
  poster: { width: '100%', height: CARD_WIDTH * 1.5, borderRadius: 10, backgroundColor: '#222' },
  title: { marginTop: 6, fontSize: 12, fontWeight: '600' },
});