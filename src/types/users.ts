import type { User } from '@supabase/supabase-js';

export interface SignupData {
    email: string;
    password: string;
    options: {
        nickname: string;
        name: string;
        birthDate: string;
        gender: string;
        isForeigner: boolean | null;
        agreeToTerms: boolean;
    };
}
export interface SupabaseResult {
    status: 'SUCCESS' | 'FAIL';
    text: string;
}

export type Signup = (signupData: SignupData) => Promise<SupabaseResult>;

export interface UpdateUserData {
    password?: string;
    metadata: {
        nickname: string;
        name: string;
        birthDate: string;
        gender: string;
        isForeigner: boolean;
    };
}
export type UpdateUser = (updateData: UpdateUserData) => Promise<boolean>;

export interface UserState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export interface UserActions {
    setUser: (user: User | null) => void;
    setLoading: (isLoading: boolean) => void;
    clearUser: () => void;
    updateUserProfile: (profile: Partial<User>) => void;
}
