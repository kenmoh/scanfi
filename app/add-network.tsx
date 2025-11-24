import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';
import { useWifiStore } from '../src/store/store';

const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF5'];
const SECURITIES = ['WPA', 'WEP', 'NONE'];

export default function AddNetworkScreen() {
    const router = useRouter();
    const { addNewNetwork } = useWifiStore();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [security, setSecurity] = useState('WPA');
    const [color, setColor] = useState(COLORS[0]);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleSave = async () => {
        if (!ssid) {
            Alert.alert('Error', 'SSID is required');
            return;
        }

        try {
            await addNewNetwork(ssid, password, security, color);
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to save network');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Add Network</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.label, { color: theme.text }]}>SSID (Network Name)</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
                    value={ssid}
                    onChangeText={setSsid}
                    placeholder="Enter SSID"
                    placeholderTextColor={theme.textSecondary}
                />

                <Text style={[styles.label, { color: theme.text }]}>Password</Text>
                <View style={[styles.passwordContainer, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
                    <TextInput
                        style={[styles.passwordInput, { color: theme.text }]}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter Password"
                        placeholderTextColor={theme.textSecondary}
                        secureTextEntry={!isPasswordVisible}
                    />
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                        <Ionicons
                            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                            size={24}
                            color={theme.textSecondary}
                        />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.label, { color: theme.text }]}>Security Type</Text>
                <View style={styles.row}>
                    {SECURITIES.map((sec) => (
                        <TouchableOpacity
                            key={sec}
                            style={[
                                styles.optionButton,
                                { backgroundColor: theme.card, borderColor: theme.border },
                                security === sec && { backgroundColor: theme.tint, borderColor: theme.tint }
                            ]}
                            onPress={() => setSecurity(sec)}
                        >
                            <Text style={[
                                styles.optionText,
                                { color: theme.text },
                                security === sec && styles.optionTextSelected
                            ]}>{sec}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[styles.label, { color: theme.text }]}>Card Color</Text>
                <View style={styles.row}>
                    {COLORS.map((c) => (
                        <TouchableOpacity
                            key={c}
                            style={[
                                styles.colorCircle,
                                { backgroundColor: c },
                                color === c && { borderColor: theme.text, transform: [{ scale: 1.1 }] }
                            ]}
                            onPress={() => setColor(c)}
                        />
                    ))}
                </View>

                <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.tint }]} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Network</Text>
                </TouchableOpacity>
            </ScrollView>
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
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 12,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 4,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
    },
    optionText: {
        fontSize: 14,
    },
    optionTextSelected: {
        color: '#FFF',
        fontWeight: '600',
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    saveButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 40,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
