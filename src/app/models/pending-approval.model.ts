export interface PendingApproval {
  id: number;
  approvalDate: Date;
  memberName: string;
  customerName: string;
  providerName: string;
  approvalAmt: number;
  onlineStatus: string;
}
