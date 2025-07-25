import { AuthRepository, StorageRepository, TUserProfileRepository, TUserRepository, VUserDetailRepository } from '@core/domain';
import { supabase } from '../saas';
import { AuthRepositoryImpl } from './authRepositoryImpl';
import { StorageRepositoryImpl } from './storageRepositoryImpl';
import { TUserProfileRepositoryImpl } from './tUserProfileRepositoryImpl';
import { TUserRepositoryImpl } from './tUserRepositoryImpl';
import { VUserDetailRepositoryImpl } from './vUserDetailRepositoryImpl';

export const authRepository: AuthRepository = new AuthRepositoryImpl(supabase);
export const storageRepository: StorageRepository = new StorageRepositoryImpl(supabase);
export const tUserRepository: TUserRepository = new TUserRepositoryImpl(supabase);
export const tUserProfileRepository: TUserProfileRepository = new TUserProfileRepositoryImpl(supabase); // Alias for consistency
export const vUserDetailRepository: VUserDetailRepository = new VUserDetailRepositoryImpl(supabase);
