import { ApprovalItemDisplay } from './approval-item-display.model';
import { Member } from './member.model';

export interface ApprovalDisplay {
  planMemberId: number;
  serviceProviderId: number;
  claimProviderId: number;
  claimNumber: number;
  customerId: number;
  cardNumber: number;
  ICDCodeId: number;
  onlineStatusId: number;
  approvalDate: Date;
  approvalItems: ApprovalItemDisplay[];
}
