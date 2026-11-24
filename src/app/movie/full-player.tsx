import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { RefreshCcw, X } from 'lucide-react-native'; // 👈 Imported RefreshCcw
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

const SERVERS = ['VidLink', 'VidSrc', '2Embed', 'Embed.su'];

export default function FullMoviePlayer() {
  const router = useRouter();
  const { id, type = 'movie', season, episode, title } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [serverIndex, setServerIndex] = useState(0);
  const [statusText, setStatusText] = useState('Connecting to fastest server...');
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Force Landscape
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  // Auto-switch Timer
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoading(true);
    setStatusText(`Connecting to ${SERVERS[serverIndex]}...`);

    timeoutRef.current = setTimeout(() => {
      if (serverIndex < SERVERS.length - 1) {
        setStatusText(`Server taking too long. Switching...`);
        setServerIndex(prev => prev + 1);
      }
    }, 15000); 

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [serverIndex]);

  const getVideoUrl = (serverName: string) => {
    switch (serverName) {
      case 'VidLink':
        return type === 'tv' && season && episode ? `https://vidlink.pro/tv/${id}/${season}/${episode}` : `https://vidlink.pro/movie/${id}`;
      case 'VidSrc':
        return type === 'tv' && season && episode ? `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}` : `https://vidsrc.me/embed/movie?tmdb=${id}`;
      case '2Embed':
        return type === 'tv' && season && episode ? `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}` : `https://www.2embed.cc/embed/${id}`;
      case 'Embed.su':
        return type === 'tv' && season && episode ? `https://embed.su/embed/tv/${id}/${season}/${episode}` : `https://embed.su/embed/movie/${id}`;
      default:
        return '';
    }
  };

  // 👇 NEW FUNCTION TO SWITCH SERVER 👇
  const handleSwitchServer = () => {
    setLoading(true);
    if (serverIndex < SERVERS.length - 1) {
      setServerIndex(prev => prev + 1);
    } else {
      setServerIndex(0); // Loop back to the first server if we run out
    }
  };

  const injectedJS = `
    window.open = function() { return null; }; 
    window.alert = function() { return null; };
  `;

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* Bottom Left: Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <X color="#fff" size={24} />
      </TouchableOpacity>

      {/* 👇 Bottom Right: Switch Server Button 👇 */}
      <TouchableOpacity style={styles.switchButton} onPress={handleSwitchServer}>
        <RefreshCcw color="#fff" size={18} />
        <Text style={styles.switchText}>Switch Server</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ff3b30" />
          <Text style={styles.loadingText}>{statusText}</Text>
        </View>
      )}
      
      <WebView 
        key={serverIndex}
        source={{ uri: getVideoUrl(SERVERS[serverIndex]) }} 
        style={styles.webView}
        
        allowsFullscreen={false} 
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        
        domStorageEnabled={true} 
        javaScriptEnabled={true} 
        
        injectedJavaScript={injectedJS}
        setSupportMultipleWindows={false}
        originWhitelist={['*']}
        mixedContentMode="always"
        
        onLoadStart={() => setLoading(true)}
        
        onLoadEnd={() => {
          setLoading(false);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }}
        
        onError={() => {
          if (serverIndex < SERVERS.length - 1) {
            setServerIndex(prev => prev + 1);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  webView: { flex: 1, backgroundColor: '#000' },
  
  closeButton: { 
    position: 'absolute', 
    bottom: 30, 
    left: 40, 
    zIndex: 100, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    padding: 12, 
    borderRadius: 50 
  },

  // 👇 STYLES FOR THE SWITCH BUTTON 👇
  switchButton: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  switchText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },

  loadingOverlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 50, 
    backgroundColor: '#000' 
  },
  loadingText: { 
    color: '#fff', 
    marginTop: 15, 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});