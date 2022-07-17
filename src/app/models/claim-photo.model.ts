import { PhotoService } from './photo-Service';

export interface ClaimPhoto {
  id: number;
  clientId: number;
  onlineEntryTypeId: number;
  providerName: string;
  clientName: string;
  onlineStatusName: string;
  userName: string;
  serverPath: string;
  stampDate: Date;
  entryType: string;
  speciality: string;
  entryUserName:  string;
  cardNumber: string;
  claimFormNumber: string;
  memberName: string;
  policyNumber: string;
  onlineStatusId: number;
  claimPhotoDetails: PhotoService[];
}
