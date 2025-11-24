import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
// @ts-ignore
import { documentDirectory, EncodingType, writeAsStringAsync } from 'expo-file-system/legacy';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';

export default function QRCodeScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { ssid, password, security } = params;
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const qrRef = useRef<any>(null);

    const qrValue = `WIFI:T:${security};S:${ssid};P:${password};;`;

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(password as string);
        Alert.alert('Copied', 'Password copied to clipboard');
    };

    const handleShare = async () => {
        if (qrRef.current) {
            qrRef.current.toDataURL(async (data: string) => {
                const filename = documentDirectory + 'wifi-qr.png';
                await writeAsStringAsync(filename, data, {
                    encoding: EncodingType.Base64,
                });
                await Sharing.shareAsync(filename);
            });
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>{ssid}</Text>
                <TouchableOpacity onPress={handleShare}>
                    <Ionicons name="share-social-outline" size={24} color={theme.tint} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={[styles.qrContainer, { backgroundColor: '#FFF' }]}>
                    <QRCode
                        value={qrValue}
                        size={250}
                        color="black"
                        backgroundColor="white"
                        getRef={(c) => (qrRef.current = c)}
                    />
                </View>

                <View style={styles.infoContainer}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Password</Text>

                    <View style={styles.passwordRow}>
                        <Text style={[styles.password, { color: theme.text }]}>
                            {isPasswordVisible ? password : '•'.repeat(password ? password.length : 8)}
                        </Text>
                        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                            <Ionicons
                                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                                size={24}
                                color={theme.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: colorScheme === 'dark' ? '#333' : '#E3F2FD' }]}
                            onPress={copyToClipboard}
                        >
                            <Ionicons name="copy-outline" size={20} color={theme.tint} />
                            <Text style={[styles.actionText, { color: theme.tint }]}>Copy Password</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: theme.tint, marginTop: 12 }]}
                            onPress={handleShare}
                        >
                            <Ionicons name="share-social-outline" size={20} color="#FFF" />
                            <Text style={[styles.actionText, { color: '#FFF' }]}>Share QR Code</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    qrContainer: {
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 40,
    },
    infoContainer: {
        alignItems: 'center',
        width: '100%',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    password: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    eyeIcon: {
        padding: 4,
    },
    actionButtons: {
        width: '100%',
        paddingHorizontal: 40,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        width: '100%',
    },
    actionText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});
