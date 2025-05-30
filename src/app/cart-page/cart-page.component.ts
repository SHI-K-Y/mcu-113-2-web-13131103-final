import { CurrencyPipe } from '@angular/common';
import { Component, inject, computed, OnInit, signal } from '@angular/core';
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

  readonly totalAmount = computed(() => {
    return this.cartService.getTotalAmount();
  });

  readonly cartItems = computed(() => {
    return this.cartService.cartItems();
  });

  readonly isEmpty = computed(() => {
    return this.cartItems().length === 0;
  });

  private readonly formValid = signal(false);

  readonly isFormValidForSubmit = computed(() => {
    return this.formValid() && !this.isEmpty();
  });

  form = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required]),
    address: new FormControl<string | null>(null, [Validators.required]),
    tel: new FormControl<string | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    // 初始化表單狀態
    this.formValid.set(this.form.valid);

    // 監聽表單狀態變化
    this.form.statusChanges.subscribe(() => {
      this.formValid.set(this.form.valid);
    });
  }

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
    if (!this.isFormValidForSubmit()) {
      alert('請確保所有必填欄位都已填寫且購物車不為空！');
      return;
    }

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
