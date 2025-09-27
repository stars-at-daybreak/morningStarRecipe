import { type ReactNode, useEffect, useRef } from 'react';
import supabase from '../services/supabaseClient.ts';
import useUserStore from '../stores/useUserStore.ts';

export function AuthProvider({ children }: { children: ReactNode }) {
    const { setUser } = useUserStore();
    const isInitialized = useRef(false);

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (!isInitialized.current) {
                isInitialized.current = true;
                setUser(session?.user ?? null);
            } else if (event !== 'INITIAL_SESSION') {
                setUser(session?.user ?? null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return <>{children}</>;
}
