import { ApprovalItem } from './approval-item.model';
import { Member } from './member.model';

export interface ApprovalDisplay {
  planMemberId: number;
  serviceProviderId: number;
  claimProviderId: number;
  claimNumber: number;
  customerId: number;
  cardNumber: number;
  ICDCode: string;
  approvalDate: Date;
  approvalItems: ApprovalItem[];
}
