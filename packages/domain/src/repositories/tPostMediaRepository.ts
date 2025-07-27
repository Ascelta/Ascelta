import { PostMedia, PostMediaType } from '../entities';

export type CreatePostMediaInput = {
  postId: string;
  type: PostMediaType;
  url: string;
  displayOrder: number;
};

export type UpdatePostMediaInput = {
  url?: string;
  displayOrder?: number;
};

export interface TPostMediaRepository {
  /**
   * 投稿メディアを作成する
   */
  create(input: CreatePostMediaInput): Promise<PostMedia>;

  /**
   * 投稿メディアIDで取得する
   */
  findById(id: string): Promise<PostMedia | null>;

  /**
   * 投稿IDで関連するメディア一覧を取得する
   */
  findByPostId(postId: string): Promise<PostMedia[]>;

  /**
   * 投稿メディアを更新する
   */
  update(id: string, input: UpdatePostMediaInput): Promise<PostMedia>;

  /**
   * 投稿メディアを削除する
   */
  delete(id: string): Promise<void>;

  /**
   * 投稿IDで関連するすべてのメディアを削除する
   */
  deleteByPostId(postId: string): Promise<void>;
}