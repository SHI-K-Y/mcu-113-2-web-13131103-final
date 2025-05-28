import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _cartItems = signal<CartItem[]>([]);

  readonly cartItems = this._cartItems.asReadonly();
  addToCart(product: Product, quantity: number = 1): void {
    const existingItemIndex = this._cartItems().findIndex((item) => item.product.id === product.id);

    if (existingItemIndex !== -1) {
      const updatedItems = [...this._cartItems()];
      updatedItems[existingItemIndex] = new CartItem({
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
      });
      this._cartItems.set(updatedItems);
    } else {
      const newItem = new CartItem({ product, quantity });
      this._cartItems.set([...this._cartItems(), newItem]);
    }
  }

  removeFromCart(productId: number): void {
    const updatedItems = this._cartItems().filter((item) => item.product.id !== productId);
    this._cartItems.set(updatedItems);
  }
  updateQuantity(productId: number, quantity: number): void {
    const updatedItems = this._cartItems().map((item) => (item.product.id === productId ? new CartItem({ ...item, quantity }) : item));
    this._cartItems.set(updatedItems);
  }

  clearCart(): void {
    this._cartItems.set([]);
  }
  getTotalAmount(): number {
    return this._cartItems().reduce((total, item) => total + item.totalPrice, 0);
  }

  getTotalItemCount(): number {
    return this._cartItems().reduce((total, item) => total + item.quantity, 0);
  }
}
