import { type ReactNode, useEffect } from 'react';
import supabase from '../services/supabaseClient.ts';
import useUserStore from '../stores/useUserStore.ts';

export function AuthProvider({ children }: { children: ReactNode }) {
    const { setUser } = useUserStore();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [setUser]);

    return <>{children}</>;
}
