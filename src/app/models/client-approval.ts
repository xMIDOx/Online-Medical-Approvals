import { ClientApprovalItem } from './client-approval-item';

export interface ClientApproval {
  memberName: string;
  approvalNum: number;
  pprovalDate: Date;
  approvalAmt: number;
  claimNum: number;
  providerName: string;
  masterBenefitName: string;
  benfitName: string;
  diagnosis: string;
  printedNotes: string;
  userName: string;
  clientApprovalItems: ClientApprovalItem[];
}
