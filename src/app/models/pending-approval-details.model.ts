import { ApprovalItemCreate } from './approval-item-create.model';

export interface PendingApprovalDetails {
  id: number;
  masterBenefitId: number;
  benefitId: number;
  approvalNumber: number;
  claimNumber: number;
  cardNumber: number;
  approvalAmt: number;
  approvalCopaymentPer: number;
  approvalCopaymentAmt: number;
  approvalDate: Date;
  planName: string;
  memberName: string
  customerName: string;
  providerName: string;
  providerCatName: string;
  diagnosis: string;
  internalNotes: string;
  printedNotes: string;
  approvalItems: ApprovalItemCreate[];
}
