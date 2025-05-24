import { TUsers } from '../types';

export interface TUserRepository {
  findByPrimaryKey(id: string): Promise<TUsers | undefined>;

  findByScreenName(screenName: string): Promise<TUsers | undefined>;

  existsByScreenName(screenName: string): Promise<boolean>;

  updateByPrimaryKey(id: string, screenName: string): Promise<void>;
}
