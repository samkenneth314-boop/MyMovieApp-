import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Load current data
    AsyncStorage.getItem('@user_name').then(val => { if (val) setName(val); });
    AsyncStorage.getItem('@user_email').then(val => { if (val) setEmail(val); });
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    try {
      await AsyncStorage.setItem('@user_name', name);
      await AsyncStorage.setItem('@user_email', email);
      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Could not save profile.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <ArrowLeft color={colors.text} size={18} />
            <Text style={{ color: colors.text, fontWeight: 'bold', marginLeft: 5 }}>Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.label, { color: colors.subText }]}>Display Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.subText + '33' }]}
            placeholder="Enter your name"
            placeholderTextColor={colors.subText}
            value={name}
            onChangeText={setName}
          />

          <Text style={[styles.label, { color: colors.subText, marginTop: 20 }]}>Email Address</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.subText + '33' }]}
            placeholder="Enter your email"
            placeholderTextColor={colors.subText}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
            <Check color="#fff" size={20} />
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },
  backBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginRight: 15 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  input: { height: 55, borderRadius: 12, paddingHorizontal: 15, fontSize: 16, borderWidth: 1 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 55, borderRadius: 12, marginTop: 40, gap: 10 },
  saveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});