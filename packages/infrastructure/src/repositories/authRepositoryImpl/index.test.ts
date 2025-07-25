import { SupabaseClient } from '@supabase/supabase-js';

const idToken = 'mocked_id_token';
const accessToken = 'mocked_access_token';
const mockAuthorize = jest.fn(() => ({
  idToken,
  accessToken,
}));
jest.mock('react-native-app-auth', () => ({
  authorize: mockAuthorize,
}));
jest.mock('@core/shared', () => ({
  OAuthConfig: {
    GOOGLE: {
      issuer: 'https://accounts.google.com',
      clientId: 'google_client_id',
      redirectUrl: 'google_redirect_url',
      scopes: ['openid', 'profile'],
    },
    X: {
      issuer: 'https://x.com',
      clientId: 'x_client_id',
      redirectUrl: 'x_redirect_url',
      scopes: ['openid', 'profile'],
      serviceConfiguration: {
        authorizationEndpoint: 'https://x.com/i/oauth2/authorize',
        tokenEndpoint: 'https://api.x.com/2/oauth2/token',
        revocationEndpoint: 'https://api.x.com/2/oauth2/revoke',
      },
    },
    DISCORD: {
      issuer: 'https://discord.com',
      clientId: 'discord_client_id',
      redirectUrl: 'discord_redirect_url',
      scopes: ['openid', 'identify', 'email'],
      serviceConfiguration: {
        authorizationEndpoint: 'https://discord.com/api/oauth2/authorize',
        tokenEndpoint: 'https://discord.com/api/oauth2/token',
      },
    },
  },
}));

jest.mock('@supabase/supabase-js');
const mockSignInWithIdToken = jest.fn();
const mockSignInAnonymously = jest.fn();
const mockSignOut = jest.fn();
const mockSupabaseClient = SupabaseClient as jest.Mock;
mockSupabaseClient.mockImplementation(() => ({
  auth: {
    signInWithIdToken: mockSignInWithIdToken,
    signInAnonymously: mockSignInAnonymously,
    signOut: mockSignOut,
  },
}));

const AuthRepositoryImpl = require('./index.ts').AuthRepositoryImpl;
const OAuthConfig = require('@core/shared').OAuthConfig;

describe('AuthRepositoryImpl', () => {
  const repository = new AuthRepositoryImpl(new mockSupabaseClient());

  beforeEach(() => {
    jest.clearAllMocks();
    mockSignInWithIdToken.mockResolvedValue({ error: null });
    mockSignInAnonymously.mockResolvedValue({ error: null });
    mockSignOut.mockResolvedValue({ error: null });
  });

  describe('#signInWithGoogle', () => {
    describe('正常系', () => {
      it(`react-native-app-auth の #authorize に ${OAuthConfig.GOOGLE} が渡されていること`, async () => {
        await repository.signInWithGoogle();
        expect(mockAuthorize).toHaveBeenCalledTimes(1);
        expect(mockAuthorize).toHaveBeenCalledWith(OAuthConfig.GOOGLE);
        expect(mockSignInWithIdToken).toHaveBeenCalledTimes(1);
        expect(mockSignInWithIdToken).toHaveBeenCalledWith({
          provider: 'google',
          token: idToken,
          access_token: accessToken,
        });
      });
    });

    describe('異常系', () => {
      it('react-native-app-auth でエラーが発生した場合、エラーが throw されること', async () => {
        const authError = new Error('OAuth authorization failed');
        (mockAuthorize as jest.Mock).mockRejectedValueOnce(authError);

        await expect(repository.signInWithGoogle()).rejects.toThrow('OAuth authorization failed');
        
        expect(mockAuthorize).toHaveBeenCalledTimes(1);
        expect(mockAuthorize).toHaveBeenCalledWith(OAuthConfig.GOOGLE);
        expect(mockSignInWithIdToken).not.toHaveBeenCalled();
      });

      it('Supabase でエラーが発生した場合、エラーが throw されること', async () => {
        const supabaseError = { message: 'Invalid token', status: 400 };
        mockSignInWithIdToken.mockResolvedValueOnce({ error: supabaseError });

        await expect(repository.signInWithGoogle()).rejects.toEqual(supabaseError);
        
        expect(mockAuthorize).toHaveBeenCalledTimes(1);
        expect(mockAuthorize).toHaveBeenCalledWith(OAuthConfig.GOOGLE);
        expect(mockSignInWithIdToken).toHaveBeenCalledTimes(1);
        expect(mockSignInWithIdToken).toHaveBeenCalledWith({
          provider: 'google',
          token: idToken,
          access_token: accessToken,
        });
      });
    });
  });

  describe('#signInWithX', () => {
    describe('正常系', () => {
      it(`react-native-app-auth の #authorize に ${OAuthConfig.X} が渡されていること`, async () => {
        await repository.signInWithX();
        expect(mockAuthorize).toHaveBeenCalledTimes(1);
        expect(mockAuthorize).toHaveBeenCalledWith(OAuthConfig.X);
        expect(mockSignInWithIdToken).toHaveBeenCalledTimes(1);
        expect(mockSignInWithIdToken).toHaveBeenCalledWith({
          provider: 'twitter',
          token: idToken,
          access_token: accessToken,
        });
      });
    });
  });

  describe('#signInWithDiscord', () => {
    describe('正常系', () => {
      it(`react-native-app-auth の #authorize に ${OAuthConfig.DISCORD} が渡されていること`, async () => {
        await repository.signInWithDiscord();
        expect(mockAuthorize).toHaveBeenCalledTimes(1);
        expect(mockAuthorize).toHaveBeenCalledWith(OAuthConfig.DISCORD);
        expect(mockSignInWithIdToken).toHaveBeenCalledTimes(1);
        expect(mockSignInWithIdToken).toHaveBeenCalledWith({
          provider: 'discord',
          token: idToken,
          access_token: accessToken,
        });
      });
    });
  });

  describe('#signInWithAnonymous', () => {
    describe('正常系', () => {
      it('supabase.auth.signInAnonymously が呼ばれること', async () => {
        await repository.signInWithAnonymous();
        expect(mockSignInAnonymously).toHaveBeenCalledTimes(1);
      });
    });
  });
});
