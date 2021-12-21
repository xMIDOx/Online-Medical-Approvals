import { KeyValue } from './key-value.model';
import { Provider } from './provider.model';

export interface User {
  id: string;
  email: string;
  userName: string;
  providerId: number;
  provider: Provider;
}
