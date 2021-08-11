import { ApprovalItemCreate } from './approval-item-create.model';

export interface ApprovalCreate {
  id: number;
  providerId: number;
  planMemberId: number;
  customerId: number;
  cardNumber: number;
  approvalNumber: number;
  claimNumber: number;
  approvalAmt: number;
  approvalCopaymentPer: number;
  approvalCopaymentAmt: number;
  approvalType: number;
  onlineStatusId: number;
  masterBenefitId: number;
  benefitId: number;
  ICDCodeId: number;
  issuedBy: string;
  approvalDate: Date;
  internalNotes: string;
  printedNotes: string;
  approvalItems: ApprovalItemCreate[];
}
