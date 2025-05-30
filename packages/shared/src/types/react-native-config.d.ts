declare module 'react-native-config' {
  interface NativeConfig {
    APP_ENV: string;
    APP_ID: string;
    APP_NAME: string;
    APP_DISPLAY_NAME: string;
    WEB_URL: string;
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    GOOGLE_OAUTH_URL_SCHEME: string;
    GOOGLE_OAUTH_CLIENT_ID: string;
    X_OAUTH_CLIENT_ID: string;
    DISCORD_OAUTH_CLIENT_ID: string;
    OAUTH_REDIRECT_URL_PATH: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
