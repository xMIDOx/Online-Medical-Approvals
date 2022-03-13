import { PhotoService } from './photo-Service';

export interface EditClaimPhoto {
  memberName: string;
  cardNumber: string;
  procedureDate: Date;
  icdCodeId: number;
  onlineStatusId: number;
  policyNumber: number;
  claimFormNumber: string;
  clientId: number;
  claimPhotoDetails: PhotoService[];
}
