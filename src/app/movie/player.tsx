import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { X } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

// 👇 MEMOIZED IFRAME: This prevents iOS Safari from reloading the video on rotation
const WebIframe = React.memo(({ url }: { url: string }) => {
  return (
    <iframe
      src={url}
      style={{ width: '100%', height: '100%', border: 'none' }}
      allowFullScreen
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      scrolling="no"
    />
  );
});

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
      {videoUrl ? (
        Platform.OS === 'web' ? (
          <View style={StyleSheet.absoluteFillObject}>
            {/* 👇 Use the Memoized component here */}
            <WebIframe url={videoUrl as string} />
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
    ...StyleSheet.absoluteFillObject,
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