import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import MovieCard from './MovieCard';

export default function MovieRow({ title, data, onPressMovie, onPressSeeAll }: any) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <TouchableOpacity onPress={onPressSeeAll}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal 
        showsHorizontalScrollIndicator={false} 
        data={data} 
        keyExtractor={(item) => item.id.toString()}
        // 👇 1. Pads the left and right so the first/last card don't touch the screen edge
        contentContainerStyle={{ paddingHorizontal: 16 }}
        // 👇 2. Adds the gap between the cards
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item }) => <MovieCard item={item} onPress={() => onPressMovie(item)} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 15 },
  title: { fontSize: 18, fontWeight: 'bold' },
  seeAll: { fontSize: 14, fontWeight: '600' },
});