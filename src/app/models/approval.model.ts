import { ApprovalItem } from './approval-item.model';
import { Member } from './member.model';

export interface Approval{
    id: number;
    approvalDate: Date;
    claimNumber: number;
    serviceProviderId: number;
    serviceProviderName: string;
    claimProviderId: number;
    claimProviderName: string;
    member: Member;
    approvalItems: ApprovalItem[]
}