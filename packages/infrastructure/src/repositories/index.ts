import { AuthRepository, TUserRepository, VUserDetailRepository } from '@core/domain';
import { supabase } from '../saas';
import { AuthRepositoryImpl } from './authRepositoryImpl';
import { TUserRepositoryImpl } from './tUserRepositoryImpl';
import { VUserDetailRepositoryImpl } from './vUserDetailRepositoryImpl';

export const authRepository: AuthRepository = new AuthRepositoryImpl(supabase);
export const tUserRepository: TUserRepository = new TUserRepositoryImpl(supabase);
export const vUserDetailRepository: VUserDetailRepository = new VUserDetailRepositoryImpl(supabase);
