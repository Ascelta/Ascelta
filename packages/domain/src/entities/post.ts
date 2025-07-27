export type PostMediaType = 'image' | 'video';

export class PostMedia {
  constructor(
    private readonly id: string,
    private readonly postId: string,
    private readonly type: PostMediaType,
    private readonly url: string,
    private readonly displayOrder: number,
    private readonly createdAt: Date,
  ) {}

  getId(): string {
    return this.id;
  }

  getPostId(): string {
    return this.postId;
  }

  getType(): PostMediaType {
    return this.type;
  }

  getUrl(): string {
    return this.url;
  }

  getDisplayOrder(): number {
    return this.displayOrder;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}

export class Post {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly text: string,
    private readonly referencedPostId: string | null,
    private readonly medias: PostMedia[],
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getText(): string {
    return this.text;
  }

  getReferencedPostId(): string | null {
    return this.referencedPostId;
  }

  getMedias(): PostMedia[] {
    return this.medias;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  hasMedia(): boolean {
    return this.medias.length > 0;
  }

  getImageMedias(): PostMedia[] {
    return this.medias.filter(media => media.getType() === 'image');
  }

  getVideoMedias(): PostMedia[] {
    return this.medias.filter(media => media.getType() === 'video');
  }
}