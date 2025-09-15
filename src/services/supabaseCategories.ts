import supabase from './supabaseClient.ts';
import type { Tables } from '../types/supabase.ts';

export const fetchCategories = async (): Promise<Tables<'categories'>[]> => {
    try {
        const { data, error } = await supabase.from('categories').select().eq('is_active', true);
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error(error);
        return [];
    }
};
