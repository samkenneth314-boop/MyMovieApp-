import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <View style={styles.searchContainer}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a movie..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Text style={styles.clearIcon}>✖</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#333', 
    marginHorizontal: 16, 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    alignItems: 'center', 
    marginBottom: 20 
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, color: '#fff', height: 50, fontSize: 16 },
  clearIcon: { color: '#888', fontSize: 16, padding: 10 },
});