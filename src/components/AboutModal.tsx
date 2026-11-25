import { Code2, Film, X } from 'lucide-react-native';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AboutModal({ visible, onClose }: AboutModalProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X color={colors.text} size={24} />
          </TouchableOpacity>

          <View style={styles.iconCircle}>
            <Film color="#F00032" size={40} />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>CineVault</Text>
          <Text style={[styles.version, { color: colors.subText }]}>Version 1.0.1</Text>

          <Text style={[styles.description, { color: colors.subText }]}>
            CineVault is your ultimate destination for discovering and streaming the latest movies and popular TV shows. 
            {'\n\n'}
            Built with a focus on a clean, seamless, and premium user experience.
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.subText + '33' }]} />

          <View style={styles.developerRow}>
            <Code2 color={colors.primary} size={20} />
            <Text style={[styles.developerText, { color: colors.text }]}>
              Developed by <Text style={{ fontWeight: 'bold', color: colors.primary }}>Sam</Text>
            </Text>
          </View>
          
          <Text style={[styles.copyright, { color: colors.subText }]}>
            © 2026 Sam. All rights reserved.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  container: { 
    width: '85%', borderRadius: 24, padding: 30, alignItems: 'center' 
  },
  closeBtn: { position: 'absolute', top: 20, right: 20, zIndex: 10 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(240, 0, 50, 0.1)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 15
  },
  title: { fontSize: 26, fontWeight: '900', letterSpacing: 1, marginBottom: 5 },
  version: { fontSize: 14, fontWeight: '600', marginBottom: 20 },
  description: { fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 20 },
  divider: { width: '100%', height: 1, marginVertical: 20 },
  developerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  developerText: { fontSize: 16 },
  copyright: { fontSize: 12, marginTop: 10 }
});