import { type ReactNode, useEffect } from 'react';
import supabase from '../services/supabaseClient.ts';
import useUserStore from '../stores/useUserStore.ts';

export function AuthProvider({ children }: { children: ReactNode }) {
    const { setUser } = useUserStore();

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return <>{children}</>;
}
