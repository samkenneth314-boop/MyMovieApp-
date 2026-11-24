import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { X } from 'lucide-react-native';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function VideoPlayer() {
  const router = useRouter();
  const { videoUrl, title } = useLocalSearchParams();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      return () => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      };
    }
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <X color="#fff" size={24} />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      {videoUrl ? (
        Platform.OS === 'web' ? (
          <iframe
            src={videoUrl as string}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
            allow="autoplay; fullscreen"
          />
        ) : (
          <WebView
            source={{ uri: videoUrl as string }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
          />
        )
      ) : (
        <Text style={{ color: 'white', alignSelf: 'center' }}>No video URL provided.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  webview: { flex: 1, backgroundColor: '#000' },
  closeButton: { 
    position: 'absolute', top: 20, left: 20, zIndex: 10, 
    backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 50 
  },
  title: { 
    position: 'absolute', top: 30, left: 70, right: 20, 
    color: '#fff', fontSize: 16, fontWeight: 'bold', zIndex: 10 
  }
});