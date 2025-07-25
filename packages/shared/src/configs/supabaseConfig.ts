import Config from 'react-native-config';

export class SupabaseConfig {
  static SUPABASE_URL: string = Config.SUPABASE_URL;
  static SUPABASE_ANON_KEY: string = Config.SUPABASE_ANON_KEY;
  static SUPABASE_SERVICE_ROLE_KEY: string = Config.SUPABASE_SERVICE_ROLE_KEY;
}
