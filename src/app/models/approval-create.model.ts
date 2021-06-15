import { ApprovalItemCreate } from './approval-item-create.model';
import { ApprovalItemDisplay } from './approval-item-display.model';

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
  ICDCodeId: number;
  issuedBy: number;
  internalNotes: string;
  approvalItems: ApprovalItemCreate[];
}
