import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const startApp = async () => {
      // Wait 2 seconds to show the logo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Go straight to the home screen
      router.replace('/home'); 
    };

    startApp();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>CINE<Text style={{color: '#ff3b30'}}>VAULT</Text></Text>
      <Text style={styles.subtitle}>WATCH • STREAM • ENJOY</Text>
      <ActivityIndicator size="large" color="#ff3b30" style={{ marginTop: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060912', justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 48, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  subtitle: { color: '#888', fontSize: 14, letterSpacing: 4, marginTop: 10 },
});