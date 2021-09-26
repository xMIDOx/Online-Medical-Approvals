export interface ClientApprovalItem {
  clientApprovalId: number;
  serviceName: string;
  serviceQnt: number;
  serviceUnitAmt: number;
  serviceTotalAmt: number;
  serviceCoPaymentPer: number;
  serviceCoPaymentAmt: number;
  serviceNetAmt: number;
  serviceNote: string;
  dosage: number;
  dosageDays: number;
  dosageTimes: number;
  dosagePerDay: number;
}
