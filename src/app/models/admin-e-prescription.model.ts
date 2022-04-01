export interface AdminEPrescription {
  providerId: number; // at login
  clientId: number; // should be at login
  onlineEntryTypeId: number;
  doctorId: string; // from DDL
  memberName: string;
  phoneNumber: string;
  policyNumber: string;
  cardNumber: string;
  providerAdminId: string; // at login
  stampDate: Date;
}
