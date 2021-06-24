export interface PlanMasterBenefits {
  id: number;
  planId: number;
  masterBenefitsId: number;
  masterBenefitName: string;
  masterCeilingAmt: number;
  maxMemberPer: number;
  maxMemberNum: number;
  availableAfterDays: number;
  isPoolMemberCeiling: number;
  memberPoolCeiling: number;
  poolMonthlyPer: number;
}
