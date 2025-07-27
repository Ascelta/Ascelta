import { IdGenerator, StorageRepository } from '@core/domain';

export type UploadPostMediaInput = {
  userId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
};

export type UploadPostMediaOutput = {
  uploadedUrl: string;
  mediaType: 'image' | 'video';
};

export class UploadPostMediaUseCase {
  private static _postMediaFolderName = 'post-medias';

  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly storageRepository: StorageRepository,
  ) {}

  async execute(input: UploadPostMediaInput): Promise<UploadPostMediaOutput> {
    const fileExtension = this.getFileExtension(input.mediaUrl, input.mediaType);
    const fileName = `${this.idGenerator.generateUuid()}.${fileExtension}`;
    
    const uploadedUrl = await this.storageRepository.uploadFile(
      'posts',
      `${input.userId}/${UploadPostMediaUseCase._postMediaFolderName}`,
      fileName,
      input.mediaUrl
    );

    return {
      uploadedUrl,
      mediaType: input.mediaType
    };
  }

  async executeMultiple(inputs: UploadPostMediaInput[]): Promise<UploadPostMediaOutput[]> {
    const uploadPromises = inputs.map(input => this.execute(input));
    return await Promise.all(uploadPromises);
  }

  private getFileExtension(url: string, type: 'image' | 'video'): string {
    // URLから拡張子を抽出
    const urlParts = url.split('.');
    const extension = urlParts[urlParts.length - 1].toLowerCase().split('?')[0]; // クエリパラメータを除去
    
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