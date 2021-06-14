import { ApprovalItem } from './approval-item.model';

export interface ApprovalCreate {
  providerId: number;
  planMemberId: number;
  customerId: number;
  cardNumber: number;
  approvalDate: Date;
  approvalNumber: number;
  claimNumber: number;
  approvalAmt: number;
  approvalCopaymentPer: number;
  approvalCopaymentAmt: number;
  approvalType: number;
  masterBenefitId: number;
  benefitId: number;
  ICDCode: string;
  issuedBy: number;
  internalNotes: string;
  approvalItems: ApprovalItem[];
}
