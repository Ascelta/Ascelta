import { Post } from '../entities';

export type CreatePostInput = {
  userId: string;
  text: string;
  referencedPostId?: string;
  medias?: Array<{
    type: 'image' | 'video';
    url: string;
    displayOrder: number;
  }>;
};

export type UpdatePostInput = {
  text?: string;
};

export interface TPostRepository {
  /**
   * 新しい投稿を作成する
   */
  create(input: CreatePostInput): Promise<Post>;

  /**
   * 投稿IDで投稿を取得する
   */
  findById(id: string): Promise<Post | null>;

  /**
   * ユーザーIDで投稿一覧を取得する
   */
  findByUserId(userId: string, limit?: number, offset?: number): Promise<Post[]>;

  /**
   * 投稿を更新する
   */
  update(id: string, input: UpdatePostInput): Promise<Post>;

  /**
   * 投稿を削除する
   */
  delete(id: string): Promise<void>;

  /**
   * タイムライン用の投稿一覧を取得する
   */
  findForTimeline(userId: string, limit?: number, offset?: number): Promise<Post[]>;
}