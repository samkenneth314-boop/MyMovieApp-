import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { CheckCircle2, Trash2 } from 'lucide-react-native'; // 👈 ICONS
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../context/ThemeContext';

export default function DownloadsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Downloading' | 'Downloaded'>('Downloaded');

  useFocusEffect(
    useCallback(() => {
      loadDownloads();
    }, [])
  );

  const loadDownloads = async () => {
    const saved = await AsyncStorage.getItem('@my_downloads');
    setDownloads(saved ? JSON.parse(saved) : []);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    const newDownloads = downloads.filter((d: any) => d.id !== id);
    setDownloads(newDownloads);
    await AsyncStorage.setItem('@my_downloads', JSON.stringify(newDownloads));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Downloads</Text>
      
      <View style={[styles.tabs, { borderBottomColor: colors.subText + '33' }]}>
        <TouchableOpacity onPress={() => setActiveTab('Downloading')} style={[styles.tabBtn, activeTab === 'Downloading' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}>
          <Text style={activeTab === 'Downloading' ? { color: colors.primary, fontSize: 16, fontWeight: 'bold' } : { color: colors.subText, fontSize: 16 }}>Downloading</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Downloaded')} style={[styles.tabBtn, activeTab === 'Downloaded' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}>
          <Text style={activeTab === 'Downloaded' ? { color: colors.primary, fontSize: 16, fontWeight: 'bold' } : { color: colors.subText, fontSize: 16 }}>Downloaded</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          
          {activeTab === 'Downloading' && (
            <Text style={[styles.emptyText, { color: colors.subText }]}>No active downloads.</Text>
          )}

          {activeTab === 'Downloaded' && (
            downloads.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.subText }]}>No downloads yet.</Text>
            ) : (
              downloads.map((movie) => (
                <View key={movie.id} style={[styles.card, { backgroundColor: colors.card }]}>
                  <TouchableOpacity style={{ flexDirection: 'row', flex: 1 }} onPress={() => router.push({ pathname: '/movie/[id]', params: { id: movie.id } })}>
                    <Image source={{ uri: `https://image.tmdb.org/t/p/w200${movie.poster_path}` }} style={styles.poster} />
                    <View style={styles.cardInfo}>
                      <Text style={[styles.cardTitle, { color: colors.text }]}>{movie.title}</Text>
                      <Text style={[styles.cardSub, { color: colors.subText }]}>{movie.release_date?.split('-')[0]} • 1080p</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 }}>
                        <CheckCircle2 color="#1DB954" size={14} />
                        <Text style={styles.downloadedText}>Downloaded (1.8GB)</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: colors.primary + '22' }]} onPress={() => handleDelete(movie.id)}>
                    <Trash2 color={colors.primary} size={20} />
                  </TouchableOpacity>
                </View>
              ))
            )
          )}

          <View style={[styles.storageBox, { backgroundColor: colors.card }]}>
            <View style={[styles.circle, { borderColor: colors.primary }]}><Text style={[styles.circleText, { color: colors.text }]}>64%</Text></View>
            <View style={{ marginLeft: 15 }}>
              <Text style={[styles.storageTitle, { color: colors.text }]}>Storage Used</Text>
              <Text style={[styles.storageSub, { color: colors.subText }]}>32GB / 50GB</Text>
            </View>
          </View>

        </ScrollView>
      )}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  header: { fontSize: 28, fontWeight: 'bold', paddingTop: 60, paddingBottom: 20 },
  tabs: { flexDirection: 'row', marginBottom: 20, borderBottomWidth: 1 },
  tabBtn: { marginRight: 20, paddingBottom: 10 },
  card: { flexDirection: 'row', borderRadius: 12, padding: 10, marginBottom: 15, alignItems: 'center' },
  poster: { width: 70, height: 100, borderRadius: 8 },
  cardInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardSub: { fontSize: 12 },
  downloadedText: { color: '#1DB954', fontSize: 12, fontWeight: 'bold' },
  deleteBtn: { padding: 10, borderRadius: 10 },
  emptyText: { textAlign: 'center', marginTop: 50 },
  storageBox: { flexDirection: 'row', borderRadius: 12, padding: 20, alignItems: 'center', marginTop: 20 },
  circle: { width: 60, height: 60, borderRadius: 30, borderWidth: 4, justifyContent: 'center', alignItems: 'center' },
  circleText: { fontWeight: 'bold', fontSize: 14 },
  storageTitle: { fontSize: 16, fontWeight: 'bold' },
  storageSub: { fontSize: 14, marginTop: 4 },
});