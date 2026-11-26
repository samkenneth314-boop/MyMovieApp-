import { useLocalSearchParams, useRouter } from 'expo-router';
import { RefreshCcw, X } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

const SERVERS = ['VidLink', 'VidSrc', '2Embed', 'Embed.su'] as const;

export default function VideoPlayer() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    videoUrl?: string;
    id?: string;
    type?: string;
    season?: string;
    episode?: string;
    title?: string;
  }>();

  const { videoUrl, id, type = 'movie', season, episode, title } = params;
  const [serverIndex, setServerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sources = useMemo(() => {
    if (!id) return videoUrl ? [{ name: 'Current source', url: videoUrl }] : [];

    const isEpisode = type === 'tv' && season && episode;
    return [
      {
        name: 'VidLink',
        url: isEpisode
          ? `https://vidlink.pro/tv/${id}/${season}/${episode}`
          : `https://vidlink.pro/movie/${id}`,
      },
      {
        name: 'VidSrc',
        url: isEpisode
          ? `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`
          : `https://vidsrc.me/embed/movie?tmdb=${id}`,
      },
      {
        name: '2Embed',
        url: isEpisode
          ? `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`
          : `https://www.2embed.cc/embed/${id}`,
      },
      {
        name: 'Embed.su',
        url: isEpisode
          ? `https://embed.su/embed/tv/${id}/${season}/${episode}`
          : `https://embed.su/embed/movie/${id}`,
      },
    ];
  }, [id, type, season, episode, videoUrl]);

  const currentSource = sources[serverIndex];

  useEffect(() => {
    setLoading(true);
    setLoadError(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (serverIndex < sources.length - 1) {
        setServerIndex(index => index + 1);
      } else {
        setLoading(false);
        setLoadError(true);
      }
    }, 20000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [serverIndex, sources.length]);

  const finishLoading = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoading(false);
    setLoadError(false);
  };

  const handleLoadError = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (serverIndex < sources.length - 1) {
      setServerIndex(index => index + 1);
    } else {
      setLoading(false);
      setLoadError(true);
    }
  };

  const switchServer = () => {
    if (sources.length < 2) return;
    setServerIndex(index => (index + 1) % sources.length);
  };

  if (!currentSource) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No video source was provided.</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X color="#fff" size={23} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <iframe
          key={currentSource.url}
          title={String(title || 'CineVault video')}
          src={currentSource.url}
          onLoad={finishLoading}
          onError={handleLoadError}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="no-referrer"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 0,
            backgroundColor: '#000',
          }}
        />
      ) : (
        <WebView
          key={currentSource.url}
          source={{ uri: currentSource.url }}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          cacheEnabled
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          setSupportMultipleWindows={false}
          onLoadEnd={finishLoading}
          onError={handleLoadError}
          onHttpError={event => {
            if (event.nativeEvent.statusCode >= 400) handleLoadError();
          }}
        />
      )}

      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#1DB954" />
          <Text style={styles.message}>Loading {currentSource.name}...</Text>
        </View>
      )}

      {loadError && (
        <View style={styles.errorOverlay}>
          <Text style={styles.message}>This source did not load. Try another server.</Text>
          <TouchableOpacity style={styles.actionButton} onPress={switchServer}>
            <RefreshCcw color="#fff" size={17} />
            <Text style={styles.actionText}>Try another server</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.controls} pointerEvents="box-none">
        <TouchableOpacity
          accessibilityLabel="Close video player"
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X color="#fff" size={23} />
        </TouchableOpacity>

        <View style={styles.topTitle} pointerEvents="none">
          <Text style={styles.title} numberOfLines={1}>{title || 'CineVault'}</Text>
          <Text style={styles.serverName}>{currentSource.name}</Text>
        </View>

        {sources.length > 1 && (
          <TouchableOpacity style={styles.switchButton} onPress={switchServer}>
            <RefreshCcw color="#fff" size={17} />
            <Text style={styles.actionText}>Switch server</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  webview: { flex: 1, backgroundColor: '#000' },
  controls: { ...StyleSheet.absoluteFillObject, zIndex: 10 },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 18,
    zIndex: 12,
    padding: 10,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  topTitle: {
    position: 'absolute',
    top: 25,
    left: 68,
    right: 150,
  },
  title: { color: '#fff', fontSize: 15, fontWeight: '600' },
  serverName: { color: '#bbb', fontSize: 11, marginTop: 3 },
  switchButton: {
    position: 'absolute',
    right: 18,
    top: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  actionText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.88)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#1DB954',
  },
  message: { color: '#fff', fontSize: 14, textAlign: 'center', marginTop: 12 },
});
