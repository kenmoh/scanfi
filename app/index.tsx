import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';
import { Network, useWifiStore } from '../src/store/store';

export default function HomeScreen() {
    const router = useRouter();
    const { networks, fetchNetworks, removeNetwork } = useWifiStore();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    useFocusEffect(
        useCallback(() => {
            fetchNetworks();
        }, [])
    );

    const handleLongPress = (id: number) => {
        Alert.alert(
            "Delete Network",
            "Are you sure you want to delete this network?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => removeNetwork(id) }
            ]
        );
    };

    const renderItem = ({ item }: { item: Network }) => (
        <TouchableOpacity
            style={[styles.card, {
                backgroundColor: theme.card,
                borderLeftColor: item.color || theme.tint
            }]}
            onPress={() => router.push({
                pathname: '/qr-code', params: {
                    ssid: item.ssid,
                    password: item.password,
                    security: item.security
                }
            })}
            onLongPress={() => handleLongPress(item.id)}
        >
            <View style={styles.cardContent}>
                <Text style={[styles.ssid, { color: theme.text }]}>{item.ssid}</Text>
                <Text style={[styles.security, { color: theme.textSecondary }]}>{item.security}</Text>
            </View>
            <Ionicons name="qr-code-outline" size={24} color={theme.icon} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                <Text style={[styles.title, { color: theme.text }]}>Wi-Fi QR Share</Text>
            </View>

            <FlatList
                data={networks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyText, { color: theme.text }]}>No networks saved yet.</Text>
                        <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>Tap the + button to add one.</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.tint }]}
                onPress={() => router.push('/add-network')}
            >
                <Ionicons name="add" size={30} color="#FFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    list: {
        padding: 16,
    },
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 6,
    },
    cardContent: {
        flex: 1,
    },
    ssid: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    security: {
        fontSize: 14,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '500',
    },
    emptySubText: {
        fontSize: 14,
        marginTop: 8,
    },
});
