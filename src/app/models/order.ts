import { OrderItem } from './order-item';

export class Order {
  constructor(initData?: Partial<Order>) {
    if (!initData) return;
    Object.assign(this, initData);
  }
  id?: number;

  customerName!: string;

  customerAddress!: string;

  customerPhone!: string;

  items!: OrderItem[];

  totalAmount!: number;

  orderDate!: Date;
}
