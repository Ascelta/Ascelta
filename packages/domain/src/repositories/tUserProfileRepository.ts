import { TUserProfiles } from '../types';

export interface TUserProfileRepository {
  findByPrimaryKey(userId: string): Promise<TUserProfiles | undefined>;

  updateByPrimaryKeySelective(userId: string, updates: Partial<Omit<TUserProfiles, 'user_id' | 'created_at' | 'updated_at'>>): Promise<TUserProfiles>;
}
