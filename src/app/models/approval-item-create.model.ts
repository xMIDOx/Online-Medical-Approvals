import { ItemStatus } from './item-status.enum';

export interface ApprovalItemCreate {
  masterBenefitId:number;
  benefitId: number;
  serviceId: number;
  serviceName: string;
  serviceQnt: number;
  serviceUnitAmt: number;
  serviceTotalAmt: number;
  serviceCopaymentPer: number;
  serviceCopaymentAmt: number;
  serviceNetAmt: number;
  serviceNote: '';
  dosage: number;
  dosageDays: number;
  dosagePerDay: number;
  dosageTime: number;
  status: number;
  isCovered: boolean;
}
