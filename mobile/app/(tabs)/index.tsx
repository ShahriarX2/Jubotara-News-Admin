import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import { api, type News } from '@/lib/api';

export default function NewsScreen() {
  const { token } = useAuth();
  const [news, setNews] = useState<News[]>([]);
  const [filtered, setFiltered] = useState<News[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setFiltered(news);
      return;
    }
    setFiltered(news.filter((n) => n.headline.toLowerCase().includes(q)));
  }, [search, news]);

  const fetchNews = useCallback(async () => {
    setError(null);
    try {
      const data = await api(`/news?page=${page}&limit=20`);
      const newsArray = data.news || data.data || data;
      setNews(Array.isArray(newsArray) ? newsArray : []);
      setTotalPages(data.totalPages ?? 1);
    } catch (e: unknown) {
      setNews([]);
      setError(e instanceof Error ? e.message : 'Unable to load news.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page]);

  useEffect(() => {
    setLoading(true);
    fetchNews();
  }, [fetchNews]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await api(`/news/${id}`, 'DELETE', undefined, token);
      setNews((prev) => prev.filter((n) => n._id !== id));
    } catch {
      setError('Failed to delete.');
    }
  };

  if (loading && news.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.heading}>News</Text>
      <TextInput
        style={styles.search}
        placeholder="Search headlines…"
        placeholderTextColor="#9ca3af"
        value={search}
        onChangeText={setSearch}
      />
      {error ? <Text style={styles.errorBanner}>{error}</Text> : null}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <ThemedText style={styles.empty}>{error ? '' : 'No articles yet.'}</ThemedText>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.imageSrc ? (
              <Image source={{ uri: item.imageSrc }} style={styles.thumb} />
            ) : (
              <View style={[styles.thumb, styles.thumbPlaceholder]} />
            )}
            <View style={styles.rowBody}>
              <ThemedText style={styles.headline} numberOfLines={2}>
                {item.headline}
              </ThemedText>
              <ThemedText style={styles.meta} numberOfLines={1}>
                {typeof item.category === 'object' ? item.category.name : item.category}
              </ThemedText>
            </View>
            <Pressable
              onPress={() => handleDelete(item._id)}
              style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.7 }]}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
      {totalPages > 1 ? (
        <View style={styles.pager}>
          <Pressable
            disabled={page <= 1}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            style={styles.pageBtn}
          >
            <Text style={styles.pageBtnText}>Previous</Text>
          </Pressable>
          <Text style={styles.pageInfo}>
            {page} / {totalPages}
          </Text>
          <Pressable
            disabled={page >= totalPages}
            onPress={() => setPage((p) => p + 1)}
            style={styles.pageBtn}
          >
            <Text style={styles.pageBtnText}>Next</Text>
          </Pressable>
        </View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  search: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  errorBanner: {
    color: '#dc2626',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  thumbPlaceholder: {
    backgroundColor: '#e5e7eb',
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
  },
  headline: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 4,
  },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  deleteText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  empty: {
    textAlign: 'center',
    marginTop: 48,
    opacity: 0.6,
  },
  pager: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 12,
  },
  pageBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pageBtnText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
  },
  pageInfo: {
    fontSize: 15,
  },
});
