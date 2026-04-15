import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';

export default function MoreScreen() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Account</ThemedText>
      <View style={styles.card}>
        <Text style={styles.label}>API base</Text>
        <Text style={styles.mono} selectable>
          {API_URL}
        </Text>
        <Text style={styles.hint}>
          Override with EXPO_PUBLIC_API_URL when building, or `extra.apiUrl` in app config.
        </Text>
      </View>
      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [styles.logout, pressed && { opacity: 0.9 }]}
      >
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    opacity: 0.6,
    marginBottom: 6,
  },
  mono: {
    fontSize: 13,
    fontFamily: 'SpaceMono',
  },
  hint: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 10,
    lineHeight: 18,
  },
  logout: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#b91c1c',
    fontSize: 16,
    fontWeight: '600',
  },
});
