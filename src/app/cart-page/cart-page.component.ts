import { CurrencyPipe } from '@angular/common';
import { Component, inject, computed, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent implements OnInit {
  private readonly router = inject(Router);

  readonly cartService = inject(CartService);

  // 使用 computed 來優化性能
  readonly totalAmount = computed(() => {
    return this.cartService.getTotalAmount();
  });

  readonly cartItems = computed(() => {
    return this.cartService.cartItems();
  });

  readonly isEmpty = computed(() => {
    return this.cartItems().length === 0;
  });

  readonly isFormValidForSubmit = computed(() => {
    return this.form.valid && !this.isEmpty();
  });

  form = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required]),
    address: new FormControl<string | null>(null, [Validators.required]),
    tel: new FormControl<string | null>(null, [Validators.required]),
  });

  ngOnInit(): void {}

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
    if (this.form.valid && this.cartService.cartItems().length > 0) {
      const orderData = {
        customerInfo: {
          name: this.form.get('name')?.value,
          address: this.form.get('address')?.value,
          tel: this.form.get('tel')?.value,
        },
        cartItems: this.cartService.cartItems(),
        totalAmount: this.cartService.getTotalAmount(),
      };

      alert('訂單已送出！');
      this.cartService.clearCart();
      this.form.reset();
      this.router.navigate(['/']);
    }
  }
}
