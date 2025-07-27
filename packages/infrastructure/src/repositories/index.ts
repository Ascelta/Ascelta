import { AuthRepository, StorageRepository, TUserProfileRepository, TUserRepository, VUserDetailRepository, TPostRepository, TPostMediaRepository } from '@core/domain';
import { supabase } from '../saas';
import { AuthRepositoryImpl } from './authRepositoryImpl';
import { StorageRepositoryImpl } from './storageRepositoryImpl';
import { TUserProfileRepositoryImpl } from './tUserProfileRepositoryImpl';
import { TUserRepositoryImpl } from './tUserRepositoryImpl';
import { VUserDetailRepositoryImpl } from './vUserDetailRepositoryImpl';
import { TPostRepositoryImpl } from './tPostRepositoryImpl';
import { TPostMediaRepositoryImpl } from './tPostMediaRepositoryImpl';

export const authRepository: AuthRepository = new AuthRepositoryImpl(supabase);
export const storageRepository: StorageRepository = new StorageRepositoryImpl(supabase);
export const tUserRepository: TUserRepository = new TUserRepositoryImpl(supabase);
export const tUserProfileRepository: TUserProfileRepository = new TUserProfileRepositoryImpl(supabase); // Alias for consistency
export const vUserDetailRepository: VUserDetailRepository = new VUserDetailRepositoryImpl(supabase);
export const tPostRepository: TPostRepository = new TPostRepositoryImpl(supabase);
export const tPostMediaRepository: TPostMediaRepository = new TPostMediaRepositoryImpl(supabase);
