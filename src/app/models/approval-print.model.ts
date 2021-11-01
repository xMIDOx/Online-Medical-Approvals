import { ApprovalItemPrint } from './approval-item-print.model';

export interface ApprovalPrint {
  id: number;
  approvalDate: Date;
  approvalNumber: number;
  claimNumber: number;
  approvalCopaymentPer: number;
  memberName: string;
  cardNumber: string;
  customerName: string;
  providerName: string;
  branchName: string;
  masterBenefitName: string;
  diagnosis: string;
  issuedBy: string;
  editedBy: string;
  internalNotes: string;
  printedNotes: string;
  approvalItems: ApprovalItemPrint[];
}
