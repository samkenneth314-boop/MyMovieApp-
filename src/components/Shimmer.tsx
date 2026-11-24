import { useEffect, useRef } from 'react';
import { Animated, Dimensions, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function Shimmer({ width, height, borderRadius = 10, style }: any) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: '#1a1f2b', opacity },
        style,
      ]}
    />
  );
}

export function ShimmerHome() {
  return (
    <View style={{ padding: 16 }}>
      <Shimmer width={width - 32} height={400} borderRadius={20} style={{ marginBottom: 20 }} />
      <Shimmer width={150} height={24} style={{ marginBottom: 15 }} />
      <View style={{ flexDirection: 'row', gap: 15 }}>
        <Shimmer width={120} height={180} />
        <Shimmer width={120} height={180} />
        <Shimmer width={120} height={180} />
      </View>
    </View>
  );
}

export function ShimmerGrid() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 16 }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Shimmer key={i} width={(width - 48) / 2} height={((width - 48) / 2) * 1.5} />
      ))}
    </View>
  );
}