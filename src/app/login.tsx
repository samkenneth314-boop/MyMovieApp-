import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    if (!name || !email) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    
    try {
      await AsyncStorage.setItem('@user_name', name);
      await AsyncStorage.setItem('@user_email', email);
      router.replace('/home');
    } catch (error) {
      Alert.alert("Error", "Could not save data.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>CINE<Text style={{color: '#ff3b30'}}>VAULT</Text></Text>
        <Text style={styles.welcome}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue watching</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060912' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },
  logo: { fontSize: 36, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 40 },
  welcome: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#888', marginBottom: 30 },
  inputContainer: { gap: 15, marginBottom: 30 },
  input: { backgroundColor: '#1a1f2b', color: '#fff', borderRadius: 12, paddingHorizontal: 20, height: 60, fontSize: 16 },
  loginBtn: { backgroundColor: '#ff3b30', padding: 18, borderRadius: 12, alignItems: 'center' },
  loginText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});