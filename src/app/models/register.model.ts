export interface Register {
  email: string;
  password: string;
  confirmPassword : string;
  providerId: number;
  specialtyId?: number;
  roles: string[];
}
