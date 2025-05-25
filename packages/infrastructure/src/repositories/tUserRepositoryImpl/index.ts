import { SupabaseClient } from '@supabase/supabase-js';
import { Database, TUserRepository, TUsers } from '@core/domain';

export class TUserRepositoryImpl implements TUserRepository {
  private static readonly TABLE_NAME = 't_users';

  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findByPrimaryKey(id: string): Promise<TUsers | undefined> {
    const { data } = await this.supabase.from(TUserRepositoryImpl.TABLE_NAME).select().eq('id', id).maybeSingle();
    return data ?? undefined;
  }

  async findByScreenName(screenName: string): Promise<TUsers | undefined> {
    const { data } = await this.supabase.from(TUserRepositoryImpl.TABLE_NAME).select().eq('screen_name', screenName).maybeSingle();
    return data ?? undefined;
  }

  async existsByScreenName(screenName: string): Promise<boolean> {
    const { data, error } = await this.supabase.from(TUserRepositoryImpl.TABLE_NAME).select('id').eq('screen_name', screenName).maybeSingle();
    if (error) {
      throw new Error(`Error checking existence of screen name: ${error.message}`);
    }
    return data !== null;
  }

  async updateByPrimaryKey(id: string, screenName: string): Promise<void> {
    const { error } = await this.supabase.from(TUserRepositoryImpl.TABLE_NAME).update({ screen_name: screenName }).eq('id', id);
    if (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }
}
