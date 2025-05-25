import { SupabaseClient } from '@supabase/supabase-js';
import { Database, TUserProfileRepository, TUserProfiles } from '@core/domain';

export class TUserProfileRepositoryImpl implements TUserProfileRepository {
  private static readonly TABLE_NAME = 't_user_profiles';

  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findByPrimaryKey(userId: string): Promise<TUserProfiles | undefined> {
    const { data } = await this.supabase.from(TUserProfileRepositoryImpl.TABLE_NAME).select().eq('user_id', userId).maybeSingle();
    return data ?? undefined;
  }

  async updateByPrimaryKeySelective(userId: string, updates: Partial<Omit<TUserProfiles, 'user_id' | 'created_at' | 'updated_at'>>): Promise<TUserProfiles> {
    const { data, error } = await this.supabase.from(TUserProfileRepositoryImpl.TABLE_NAME).update(updates).eq('user_id', userId).select().maybeSingle();

    if (error) {
      throw new Error(`Error updating user profile: ${error.message}`);
    }

    return data! ?? undefined;
  }
}
