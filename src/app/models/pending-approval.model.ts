export interface PendingApproval {
  id: number;
  procedureDate: Date;
  memberName: string;
  customerName: string;
  providerName: string;
  approvalAmt: number;
  onlineStatus: string;
}
