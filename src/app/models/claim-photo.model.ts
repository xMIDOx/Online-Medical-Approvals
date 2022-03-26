import { PhotoService } from './photo-Service';

export interface ClaimPhoto {
  id: number;
  providerName: string;
  clientName: string;
  onlineStatusName: string;
  userName: string;
  serverPath: string;
  stampDate: Date;
  claimPhotoDetails: PhotoService[];

}
