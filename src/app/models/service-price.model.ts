export interface ServicePrice {
  id: number; // PricingId
  name: string; // ServiceName OR DrugName Name
  serviceId: number;
  servicePrice: number;
  servicDiscountPer: number;
}
