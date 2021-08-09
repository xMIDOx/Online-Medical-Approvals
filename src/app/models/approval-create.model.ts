import { ApprovalItemCreate } from './approval-item-create.model';
import { ApprovalItemDisplay } from './approval-item-display.model';

export interface ApprovalCreate {
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
  approvalItems: ApprovalItemCreate[];
}
