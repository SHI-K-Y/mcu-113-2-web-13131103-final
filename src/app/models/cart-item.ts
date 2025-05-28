import { Product } from './product';

export class CartItem {
  constructor(initData?: Partial<CartItem>) {
    if (!initData) return;
    Object.assign(this, initData);
  }

  product!: Product;
  quantity!: number;

  get totalPrice(): number {
    return this.product.price * this.quantity;
  }
}
