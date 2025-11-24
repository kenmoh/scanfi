import { create } from 'zustand';
import { addNetwork, deleteNetwork, getNetworks } from '../db/database';

export interface Network {
    id: number;
    ssid: string;
    password: string;
    security: string;
    color: string;
    created_at: string;
}

interface WifiStore {
    networks: Network[];
    loading: boolean;
    fetchNetworks: () => Promise<void>;
    addNewNetwork: (ssid: string, password: string, security: string, color: string) => Promise<void>;
    removeNetwork: (id: number) => Promise<void>;
}

export const useWifiStore = create<WifiStore>((set, get) => ({
    networks: [],
    loading: false,
    fetchNetworks: async () => {
        set({ loading: true });
        try {
            const networks = await getNetworks();
            set({ networks: networks as Network[], loading: false });
        } catch (error) {
            console.error('Failed to fetch networks', error);
            set({ loading: false });
        }
    },
    addNewNetwork: async (ssid, password, security, color) => {
        try {
            await addNetwork(ssid, password, security, color);
            await get().fetchNetworks();
        } catch (error) {
            console.error('Failed to add network', error);
            throw error;
        }
    },
    removeNetwork: async (id) => {
        try {
            await deleteNetwork(id);
            await get().fetchNetworks();
        } catch (error) {
            console.error('Failed to delete network', error);
            throw error;
        }
    },
}));
