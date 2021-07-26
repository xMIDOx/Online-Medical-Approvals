export interface Member {
  id: number;
  memberName: string;
  planId: number;
  cardNumber: number;
  customerId: number;
  customerName: string;
  isActive: boolean;
  statusName?: 'Active' | 'Stopped';
}
