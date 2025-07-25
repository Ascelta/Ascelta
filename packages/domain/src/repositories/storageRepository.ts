import { StorageType } from '../types/storageType.ts';

export interface StorageRepository {
  uploadFile(storageType: StorageType, path: string, filename: string, fileUri: string): Promise<string>;

  deleteFile(storageType: StorageType, path: string): Promise<void>;
}
