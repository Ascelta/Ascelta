import { StorageType } from '../types/storageType.ts';

export interface StorageRepository {
  uploadFile(storageType: StorageType, path: string, filename: string, fileUri: string): Promise<string>;

  uploadFileByBase64(storageType: StorageType, path: string, filename: string, base64: string): Promise<string>;

  deleteFile(storageType: StorageType, path: string): Promise<void>;
}
