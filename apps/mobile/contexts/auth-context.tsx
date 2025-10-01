import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
import { createStore, StoreApi, useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { useSessionQuery } from '@/hook/use-session';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user?: User | null) => void;
  logout: () => Promise<void>;
  updateUser: (user?: Partial<User> | ((prev: User) => Partial<User>)) => void;
  refreshSession: () => Promise<void>;
};

const secureStorage = {
  getItem: async (name: string) => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

const AuthContext = createContext<StoreApi<AuthStore> | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const [store] = useState(() =>
    createStore<AuthStore>()(
      persist(
        (set, get) => ({
          user: null,
          isAuthenticated: false,
          isLoading: true,
          setUser: (user) => {
            set({
              user: user ?? null,
              isAuthenticated: !!user,
              isLoading: false,
            });
          },
          logout: async () => {
            try {
              await axios.post('/api/auth/logout');
            } finally {
              set({ user: null, isAuthenticated: false, isLoading: false });

              // Invalidate the session query so it re-fetches
              get().refreshSession();
            }
          },
          updateUser: (user) => {
            const currentUser = get().user;
            if (!currentUser) return;

            if (typeof user === 'function') {
              const updatedUser = user(currentUser);
              set({ user: { ...currentUser, ...updatedUser } });
            } else {
              set({
                user: { ...currentUser, ...user },
              });
            }
          },
          refreshSession: async () => {
            await queryClient.invalidateQueries({ queryKey: ['session'] });
          },
        }),
        {
          name: 'edulite-user-storage',
          storage: createJSONStorage(() => secureStorage),
          partialize: (state) => ({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            isLoading: state.isLoading,
          }),
        },
      ),
    ),
  );

  const { data, isLoading, isSuccess } = useSessionQuery();

  useEffect(() => {
    if (isSuccess) {
      store.getState().setUser(data?.user ?? null);
    } else if (!isLoading && !data) {
      store.getState().setUser(null);
    }
  }, [data, isLoading, isSuccess, store]);

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const store = useContext(AuthContext);
  if (!store) throw new Error('useAuth must be used within an AuthProvider');
  return useStore(store);
}
