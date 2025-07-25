import { SupabaseClient } from '@supabase/supabase-js';
import RNFS from 'react-native-fs';
import { Database } from '@core/domain';
import { StorageRepository } from '@core/domain/src/repositories/storageRepository.ts';
import { StorageType } from '@core/domain/src/types/storageType.ts';

const getMimeType = (filename: string): string => {
  const extension = filename.toLowerCase().split('.').pop();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'bmp':
      return 'image/bmp';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
};

export class StorageRepositoryImpl implements StorageRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async uploadFile(storageType: StorageType, path: string, filename: string, fileUri: string): Promise<string> {
    try {
      // Check if file exists
      const fileExists = RNFS.exists(fileUri);
      if (!fileExists) {
        throw new Error(`File does not exist: ${fileUri}`);
      }
      
      // Read file as base64
      const base64Data = await RNFS.readFile(fileUri, 'base64');
      
      // Convert base64 to ArrayBuffer
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const contentType = getMimeType(filename);
      
      const bucket = this.supabase.storage.from(storageType);
      const uploadPath = `${path}/${filename}`;
      
      const { error } = await bucket.upload(uploadPath, bytes, {
        contentType,
        upsert: true,
      });
      
      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }
      
      const {
        data: { publicUrl },
      } = bucket.getPublicUrl(uploadPath);
      
      return publicUrl;
    } catch (error) {
      console.error('StorageRepositoryImpl uploadFile error:', error);
      throw error;
    }
  }

  async deleteFile(storageType: StorageType, path: string): Promise<void> {
    await this.supabase.storage.from(storageType).remove([path]);
  }
}
