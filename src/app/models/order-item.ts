export class OrderItem {
  constructor(initData?: Partial<OrderItem>) {
    if (!initData) return;
    Object.assign(this, initData);
  }

  productName!: string;
  quantity!: number;
  price!: number;

  get totalPrice(): number {
    return this.price * this.quantity;
  }
}
