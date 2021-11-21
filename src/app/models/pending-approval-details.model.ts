import { ApprovalItemCreate } from './approval-item-create.model';

export interface PendingApprovalDetails {
  id: number;
  providerId: number;
  branchId: number;
  customerId: number;
  planMemberId: number;
  masterBenefitId: number;
  benefitId: number;
  icdCodeId: number;
  approvalType: number;
  approvalStatus: number;
  onlineStatusId: number;
  issuedBy: string;
  approvalNumber: number;
  claimNumber: number;
  cardNumber: number;
  approvalAmt: number;
  approvalCopaymentPer: number;
  approvalCopaymentAmt: number;
  approvalDate: Date;
  maxApprovalAmt: number;
  batchId: number;
  batchNumber: number;

  // For Display
  planName: string;
  memberName: string;
  memberStatus: string;
  customerName: string;
  providerName: string;
  providerCatName: string;
  icdCode: string;
  diagnosis: string;
  internalNotes: string;
  printedNotes: string;

  approvalItems: ApprovalItemCreate[];
}
