import { ApprovalItemDisplay } from './approval-item-display.model';

export interface ApprovalDisplay {
  id: number;
  planMemberId: number;
  serviceProviderId: number;
  claimProviderId: number;
  claimNumber: number;
  customerId: number;
  cardNumber: number;
  ICDCodeId: number;
  onlineStatusId: number;
  approvalDate: Date;
  issuedBy: string;
  printedNotes: string;
  approvalItems: ApprovalItemDisplay[];
}
