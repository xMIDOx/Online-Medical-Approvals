export interface Member {
  id: number;
  memberName: string;
  cardNumber: number;
  customerId: number;
  customerName: string;
  isActive: boolean;
  statusName?: 'Active' | 'Stopped';
}
