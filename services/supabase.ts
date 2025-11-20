
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { createClient } from '@supabase/supabase-js';

// YOUR SUPABASE CREDENTIALS
const supabaseUrl = 'https://dsrufuqpdwonwxxwmcgd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzcnVmdXFwZHdvbnd4eHdtY2dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDIyNzcsImV4cCI6MjA3OTIxODI3N30.Dlq0yJ7P4ruoDNutKjDjuBWrd_i6BRxY2ujKc59WbBU';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to check connection
export const checkConnection = async () => {
    try {
        const { count, error } = await supabase.from('projects').select('*', { count: 'exact', head: true });
        if (error) throw error;
        return true;
    } catch (e) {
        console.error("Supabase connection check failed:", e);
        return false;
    }
};
