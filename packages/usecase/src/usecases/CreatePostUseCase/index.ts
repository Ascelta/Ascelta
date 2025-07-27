import { IdGenerator, StorageRepository, TPostRepository, Post } from '@core/domain';

export type CreatePostInput = {
  userId: string;
  text: string;
  imageUrls?: string[];
  videoUrls?: string[];
  referencedPostId?: string;
};

export class CreatePostUseCase {
  private static _postMediaFolderName = 'post-medias';

  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly storageRepository: StorageRepository,
    private readonly tPostRepository: TPostRepository,
  ) {}

  async execute(input: CreatePostInput): Promise<Post> {
    const medias: Array<{
      type: 'image' | 'video';
      url: string;
      displayOrder: number;
    }> = [];

    // 画像のアップロード
    if (input.imageUrls && input.imageUrls.length > 0) {
      for (let i = 0; i < input.imageUrls.length; i++) {
        const uploadedUrl = await this.uploadMedia(input.userId, input.imageUrls[i], 'image');
        medias.push({
          type: 'image',
          url: uploadedUrl,
          displayOrder: i
        });
      }
    }

    // 動画のアップロード
    if (input.videoUrls && input.videoUrls.length > 0) {
      const imageCount = input.imageUrls?.length || 0;
      for (let i = 0; i < input.videoUrls.length; i++) {
        const uploadedUrl = await this.uploadMedia(input.userId, input.videoUrls[i], 'video');
        medias.push({
          type: 'video',
          url: uploadedUrl,
          displayOrder: imageCount + i
        });
      }
    }

    // 投稿作成
    return await this.tPostRepository.create({
      userId: input.userId,
      text: input.text,
      referencedPostId: input.referencedPostId,
      medias: medias.length > 0 ? medias : undefined
    });
  }

  private async uploadMedia(userId: string, mediaUrl: string, type: 'image' | 'video'): Promise<string> {
    const fileExtension = this.getFileExtension(mediaUrl, type);
    const fileName = `${this.idGenerator.generateUuid()}.${fileExtension}`;
    
    return await this.storageRepository.uploadFile(
      'posts',
      `${userId}/${CreatePostUseCase._postMediaFolderName}`,
      fileName,
      mediaUrl
    );
  }

  private getFileExtension(url: string, type: 'image' | 'video'): string {
    // URLから拡張子を抽出
    const urlParts = url.split('.');
    const extension = urlParts[urlParts.length - 1].toLowerCase();
    
    // 拡張子の検証
    if (type === 'image') {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
      return imageExtensions.includes(extension) ? extension : 'jpg';
    } else {
      const videoExtensions = ['mp4', 'mov', 'avi', 'webm'];
      return videoExtensions.includes(extension) ? extension : 'mp4';
    }
  }
}