import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
import { OrderItem } from '../models/order-item';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent {
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);

  form = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required]),
    address: new FormControl<string | null>(null, [Validators.required]),
    tel: new FormControl<string | null>(null, [Validators.required]),
  });

  get name(): FormControl<string | null> {
    return this.form.get('name') as FormControl<string | null>;
  }

  get address(): FormControl<string | null> {
    return this.form.get('address') as FormControl<string | null>;
  }

  get tel(): FormControl<string | null> {
    return this.form.get('tel') as FormControl<string | null>;
  }

  updateQuantity(productId: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const quantity = +target.value;
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  submitOrder(): void {
    // 建立訂單資料
    const orderItems = this.cartService.cartItems().map(
      (cartItem) =>
        new OrderItem({
          productName: cartItem.product.name,
          quantity: cartItem.quantity,
          price: cartItem.product.price,
        })
    );

    // 取得台灣時間 (UTC+8)
    const now = new Date();
    const taiwanTime = new Date(now.getTime() + 8 * 60 * 60 * 1000); // UTC+8
    const formattedDate = taiwanTime.toISOString().replace('T', ' ').substring(0, 19) + ' (UTC+8)';

    const order = new Order({
      customerName: this.form.get('name')?.value || '',
      customerAddress: this.form.get('address')?.value || '',
      customerPhone: this.form.get('tel')?.value || '',
      items: orderItems,
      totalAmount: this.cartService.getTotalAmount(),
      orderDate: formattedDate,
    });

    // 送出訂單到資料庫
    this.orderService.submitOrder(order).subscribe({
      next: (response) => {
        alert('訂單已送出');
        this.cartService.clearCart();
        this.form.reset();
        this.router.navigate(['/']);
      },
    });
  }
}
