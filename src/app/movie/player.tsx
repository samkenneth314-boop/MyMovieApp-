import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function VideoPlayer() {
  const router = useRouter();
  const { videoUrl, title } = useLocalSearchParams();
  
  // Ref to attempt auto-fullscreen on web
  const iframeRef = useRef<any>(null);

  useEffect(() => {
    // Attempt to force fullscreen on web browsers
    if (Platform.OS === 'web' && iframeRef.current) {
      try {
        if (iframeRef.current.requestFullscreen) {
          iframeRef.current.requestFullscreen().catch((err: any) => {
            console.log("Auto-fullscreen blocked by browser (requires user tap):", err);
          });
        } else if (iframeRef.current.webkitRequestFullscreen) { /* Safari */
          iframeRef.current.webkitRequestFullscreen();
        }
      } catch (error) {
        console.log("Fullscreen error:", error);
      }
    }
  }, [videoUrl]);

  return (
    <View style={styles.container}>
      {videoUrl ? (
        Platform.OS === 'web' ? (
          // 👇 FIXED: Replaced absoluteFillObject with manual absolute positioning
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <iframe
              ref={iframeRef}
              src={videoUrl as string}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              scrolling="no"
            />
          </View>
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

      <View style={styles.overlay} pointerEvents="box-none">
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X color="#fff" size={24} />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  webview: { flex: 1, backgroundColor: '#000' },
  overlay: {
    // 👇 FIXED: Replaced absoluteFillObject with manual absolute positioning
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    zIndex: 10,
  },
  closeButton: { 
    position: 'absolute', top: 20, left: 20, 
    backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 50 
  },
  title: { 
    position: 'absolute', top: 30, left: 70, right: 20, 
    color: '#fff', fontSize: 16, fontWeight: 'bold' 
  }
});