import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

import type { Database } from '../types/database';

// Supabase ist die einzige Backend-Anbindung (siehe docs/ADR/004-Database.md). Das Frontend
// kommuniziert ausschließlich über den Service Layer mit diesem Client (docs/ADR/005-API-Architecture.md)
// — kein direkter Import von `supabase` außerhalb von `src/services/`. Der generische `Database`-Typ
// sorgt für typisierte `.from(...)`-Aufrufe passend zu den Migrationen unter `supabase/migrations/`.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'EXPO_PUBLIC_SUPABASE_URL und EXPO_PUBLIC_SUPABASE_ANON_KEY müssen gesetzt sein (siehe .env.example).',
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
