import { SupabaseClient } from '@supabase/supabase-js';
import { Database, TPostMediaRepository, CreatePostMediaInput, UpdatePostMediaInput, PostMedia } from '@core/domain';

export class TPostMediaRepositoryImpl implements TPostMediaRepository {
  private static readonly TABLE_NAME = 't_post_medias';

  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create(input: CreatePostMediaInput): Promise<PostMedia> {
    const { data, error } = await this.supabase
      .from(TPostMediaRepositoryImpl.TABLE_NAME)
      .insert({
        post_id: input.postId,
        type: input.type,
        url: input.url,
        display_order: input.displayOrder
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating post media: ${error.message}`);
    }

    return this.mapToPostMedia(data);
  }

  async findById(id: string): Promise<PostMedia | null> {
    const { data, error } = await this.supabase
      .from(TPostMediaRepositoryImpl.TABLE_NAME)
      .select()
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Error finding post media by id: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return this.mapToPostMedia(data);
  }

  async findByPostId(postId: string): Promise<PostMedia[]> {
    const { data, error } = await this.supabase
      .from(TPostMediaRepositoryImpl.TABLE_NAME)
      .select()
      .eq('post_id', postId)
      .order('display_order', { ascending: true });

    if (error) {
      throw new Error(`Error finding post medias by post id: ${error.message}`);
    }

    return data.map(media => this.mapToPostMedia(media));
  }

  async update(id: string, input: UpdatePostMediaInput): Promise<PostMedia> {
    const updateData: any = {};
    if (input.url !== undefined) updateData.url = input.url;
    if (input.displayOrder !== undefined) updateData.display_order = input.displayOrder;

    const { data, error } = await this.supabase
      .from(TPostMediaRepositoryImpl.TABLE_NAME)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating post media: ${error.message}`);
    }

    return this.mapToPostMedia(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(TPostMediaRepositoryImpl.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting post media: ${error.message}`);
    }
  }

  async deleteByPostId(postId: string): Promise<void> {
    const { error } = await this.supabase
      .from(TPostMediaRepositoryImpl.TABLE_NAME)
      .delete()
      .eq('post_id', postId);

    if (error) {
      throw new Error(`Error deleting post medias by post id: ${error.message}`);
    }
  }

  private mapToPostMedia(data: any): PostMedia {
    return new PostMedia(
      data.id,
      data.post_id,
      data.type,
      data.url,
      data.display_order,
      new Date(data.created_at)
    );
  }
}