export interface PlanMasterBenefit {
  id: number;
  planId: number;
  masterBenefitsId: number;
  masterBenefitName: string;
  masterCeilingAmt: number;
  maxMemberPer: number;
  maxMemberNum: number;
  availableAfterDays: number;
  isPoolMemberCeiling: boolean;
  memberPoolCeiling: number;
  poolMonthlyPer: number;
}
