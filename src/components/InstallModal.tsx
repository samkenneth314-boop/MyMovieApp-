import { Smartphone, X } from 'lucide-react-native';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface InstallModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function InstallModal({ visible, onClose }: InstallModalProps) {
  const { colors } = useTheme();

  const handleInstall = () => {
    if (Platform.OS === 'web') {
      window.location.href = '/install.mobileconfig';
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X color={colors.text} size={24} />
          </TouchableOpacity>

          <View style={styles.iconCircle}>
            <Smartphone color="#F00032" size={32} />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>Install CineVault</Text>
          <Text style={[styles.subtitle, { color: colors.subText }]}>
            Add CineVault to your Home Screen for the best full-screen experience without the Safari browser bars.
          </Text>

          <View style={styles.stepContainer}>
            <View style={styles.stepRow}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={[styles.stepText, { color: colors.text }]}>Tap the button below to download the profile.</Text>
            </View>
            <View style={styles.stepRow}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={[styles.stepText, { color: colors.text }]}>Tap <Text style={{fontWeight: 'bold'}}>Allow</Text> when Safari asks to download the profile.</Text>
            </View>
            <View style={styles.stepRow}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={[styles.stepText, { color: colors.text }]}>Open your iPhone <Text style={{fontWeight: 'bold'}}>Settings</Text> app.</Text>
            </View>
            <View style={styles.stepRow}>
              <Text style={styles.stepNumber}>4</Text>
              <Text style={[styles.stepText, { color: colors.text }]}>Tap <Text style={{fontWeight: 'bold'}}>Profile Downloaded</Text> and press <Text style={{fontWeight: 'bold'}}>Install</Text>.</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.installButton} onPress={handleInstall}>
            <Smartphone color="#fff" size={20} />
            <Text style={styles.installButtonText}>Download Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  container: { 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 30, 
    paddingBottom: 50 
  },
  closeBtn: { position: 'absolute', top: 20, right: 20, zIndex: 10 },
  iconCircle: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(240, 0, 50, 0.1)',
    justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 15
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 14, marginBottom: 25, lineHeight: 20, textAlign: 'center' },
  stepContainer: { marginBottom: 30 },
  stepRow: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-start' },
  stepNumber: { 
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#F00032', 
    color: '#fff', textAlign: 'center', fontWeight: 'bold', lineHeight: 24, 
    marginRight: 12, fontSize: 12 
  },
  stepText: { fontSize: 14, flex: 1, lineHeight: 20 },
  installButton: { 
    backgroundColor: '#F00032', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 12,
    gap: 10
  },
  installButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});