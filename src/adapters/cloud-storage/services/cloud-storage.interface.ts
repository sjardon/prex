export const CLOUD_STORAGE_SERVICE = 'CLOUD_STORAGE_SERVICE';

export interface ICloudStorageService {
  save(file: Buffer, name: string, mimetype: string): Promise<boolean>;
  delete(name: string): Promise<boolean>;
  get(name: string): Promise<Buffer>;
}
