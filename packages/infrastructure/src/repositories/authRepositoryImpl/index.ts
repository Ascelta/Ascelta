import { authorize } from 'react-native-app-auth';
import { SupabaseClient } from '@supabase/supabase-js';
import { OAuthConfig } from '@core/shared';
import { AuthProviderType, AuthRepository, AuthStatus, Database, User } from '@core/domain';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  onAuthStateChange(callback: (authStatus: AuthStatus, userId: string | undefined) => void): () => void {
    const { data } = this.supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case 'SIGNED_IN':
        case 'SIGNED_OUT':
          callback(event, session?.user.id);
      }
    });
    return data.subscription.unsubscribe;
  }

  async getCurrentUserId(): Promise<string | undefined> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    return user?.id;
  }

  async getCurrentUser(): Promise<User | undefined> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) {
      return undefined;
    }
    return new User(
      user.id,
      (user.user_metadata['display_name'] as string) ?? '',
      user.email ?? '',
      user.identities?.map(identity => identity.provider as AuthProviderType) ?? [],
      !!user.is_anonymous,
      new Date(user.created_at),
      user.last_sign_in_at ? new Date(user.last_sign_in_at!) : undefined,
    );
  }

  async signInWithApple(): Promise<void> {
    // Implementation for signing in with Apple
  }

  async signInWithGoogle(): Promise<void> {
    const { idToken, accessToken } = await authorize(OAuthConfig.GOOGLE);
    const { error } = await this.supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
      access_token: accessToken,
    });

    if (error) {
      throw error;
    }
  }

  async signInWithX(): Promise<void> {
    const { idToken, accessToken } = await authorize(OAuthConfig.X);
    await this.supabase.auth.signInWithIdToken({
      provider: 'twitter',
      token: idToken,
      access_token: accessToken,
    });
  }

  async signInWithTwitch(): Promise<void> {
    // Implementation for signing in with Twitch
  }

  async signInWithDiscord(): Promise<void> {
    const { idToken, accessToken } = await authorize(OAuthConfig.DISCORD);
    await this.supabase.auth.signInWithIdToken({
      provider: 'discord',
      token: idToken,
      access_token: accessToken,
    });
  }

  async signInWithAnonymous(): Promise<void> {
    await this.supabase.auth.signInAnonymously();
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }
}
