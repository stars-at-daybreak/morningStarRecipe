import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import type { UserActions, UserState } from '../types/users.ts';
import { devtools } from 'zustand/middleware';

const useUserStore = create<UserState & UserActions>()(
    devtools(
        (set, get) => ({
            user: null,
            isLoading: true,
            isAuthenticated: false,

            setUser: (user: User | null) => {
                set(
                    {
                        user,
                        isAuthenticated: !!user,
                        isLoading: false,
                    },
                    false,
                    'setUser'
                );
            },
            setLoading: (isLoading: boolean) => {
                set({ isLoading }, false, 'setLoading');
            },
            clearUser: () => {
                set(
                    {
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    },
                    false,
                    'clearUser'
                );
            },
            updateUserProfile: (profile: Partial<User>) => {
                const currentUser = get().user;
                if (currentUser) {
                    set(
                        {
                            user: { ...currentUser, ...profile },
                        },
                        false,
                        'updateUserProfile'
                    );
                }
            },
        }),
        {
            name: 'user-store',
        }
    )
);

export default useUserStore;
