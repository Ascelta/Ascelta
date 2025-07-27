import { SupabaseClient } from '@supabase/supabase-js';
import { Database, TPostRepository, CreatePostInput, UpdatePostInput, Post, PostMedia } from '@core/domain';

export class TPostRepositoryImpl implements TPostRepository {
  private static readonly TABLE_NAME = 't_posts';
  private static readonly MEDIA_TABLE_NAME = 't_post_medias';

  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create(input: CreatePostInput): Promise<Post> {
    const { data, error } = await this.supabase.rpc('create_post', {
      timeline_type: 'post',
      text: input.text,
      medias: input.medias || []
    });

    if (error) {
      throw new Error(`Error creating post: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from create_post function');
    }

    return this.findById(data);
  }

  async findById(id: string): Promise<Post | null> {
    const { data, error } = await this.supabase
      .from(TPostRepositoryImpl.TABLE_NAME)
      .select(`
        *,
        ${TPostRepositoryImpl.MEDIA_TABLE_NAME} (*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Error finding post by id: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return this.mapToPost(data);
  }

  async findByUserId(userId: string, limit = 20, offset = 0): Promise<Post[]> {
    const { data, error } = await this.supabase
      .from(TPostRepositoryImpl.TABLE_NAME)
      .select(`
        *,
        ${TPostRepositoryImpl.MEDIA_TABLE_NAME} (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error finding posts by user id: ${error.message}`);
    }

    return data.map(post => this.mapToPost(post));
  }

  async update(id: string, input: UpdatePostInput): Promise<Post> {
    const { error } = await this.supabase
      .from(TPostRepositoryImpl.TABLE_NAME)
      .update({
        text: input.text,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Error updating post: ${error.message}`);
    }

    const updatedPost = await this.findById(id);
    if (!updatedPost) {
      throw new Error('Post not found after update');
    }

    return updatedPost;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(TPostRepositoryImpl.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting post: ${error.message}`);
    }
  }

  async findForTimeline(userId: string, limit = 20, offset = 0): Promise<Post[]> {
    // タイムライン用のクエリ - フォローしているユーザーと自分の投稿を取得
    const { data, error } = await this.supabase
      .from(TPostRepositoryImpl.TABLE_NAME)
      .select(`
        *,
        ${TPostRepositoryImpl.MEDIA_TABLE_NAME} (*)
      `)
      .or(`user_id.eq.${userId},user_id.in.(select following_user_id from t_user_follows where follower_user_id = '${userId}')`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error finding timeline posts: ${error.message}`);
    }

    return data.map(post => this.mapToPost(post));
  }

  private mapToPost(data: any): Post {
    const medias = (data.t_post_medias || []).map((media: any) => 
      new PostMedia(
        media.id,
        media.post_id,
        media.type,
        media.url,
        media.display_order,
        new Date(media.created_at)
      )
    ).sort((a: PostMedia, b: PostMedia) => a.getDisplayOrder() - b.getDisplayOrder());

    return new Post(
      data.id,
      data.user_id,
      data.text,
      data.referenced_post_id,
      medias,
      new Date(data.created_at),
      new Date(data.updated_at)
    );
  }
}