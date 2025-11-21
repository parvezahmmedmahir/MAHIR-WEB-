
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { createClient } from '@supabase/supabase-js';

// We access environment variables via process.env which are injected by Vite's `define` plugin.
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://dsrufuqpdwonwxxwmcgd.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzcnVmdXFwZHdvbnd4eHdtY2dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDIyNzcsImV4cCI6MjA3OTIxODI3N30.Dlq0yJ7P4ruoDNutKjDjuBWrd_i6BRxY2ujKc59WbBU';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Skill {
    title: string;
    category: string;
    description: string;
    icon: string; // e.g. 'CurrencyDollarIcon'
}

export interface UserProfile {
    id?: string;
    full_name: string;
    tagline: string;
    bio: string;
    avatar_url: string;
    telegram_link: string;
    github_link: string;
    email: string;
    skills?: Skill[];
    // New Configuration Fields
    hero_headline?: string;
    hero_subheadline?: string;
    show_preloaded?: boolean;
}

// Helper to check connection
export const checkConnection = async () => {
    try {
        // Try to fetch one row from projects to verify read access
        const { error } = await supabase.from('projects').select('id').limit(1);
        if (error) {
            // If table doesn't exist, that's a specific error code (42P01), but generally means connection is technically working but schema is missing.
            // If network error, it will be different.
            console.warn("Supabase check warning:", error.message);
            // We return true if the error is NOT a network/connection error
            return !error.message.includes("FetchError") && !error.message.includes("Failed to fetch");
        }
        return true;
    } catch (e) {
        console.error("Supabase connection check failed:", e);
        return false;
    }
};
