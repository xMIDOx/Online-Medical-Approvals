export interface PlanBenefit {
  id: number;
  planId: number;
  masterBenefitsId: number;
  benefitId: number;
  benefitName: string;
  maxCeilingAmt: number;
  coPaymentPer: number;
  isMonthlyPercentage: boolean;
  isExclusivePrimary: boolean;
  maxSessionsNumber: number;
  availableAfterDays: number;
  maxMemberPer: number;
  maxMemberNum: number;
}
