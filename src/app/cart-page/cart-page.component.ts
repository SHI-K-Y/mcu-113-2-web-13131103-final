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
  readonly totalAmount = computed(() => {
    return this.cartService.getTotalAmount();
  });
  form = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required]),
    address: new FormControl<string | null>(null, [Validators.required]),
    tel: new FormControl<string | null>(null, [Validators.required]),
    cartItems: new FormArray([]),
  });

  ngOnInit(): void {
    this.initializeCartItemFormControls();
  }

  // 簡單的為每個購物車項目建立 FormControl
  initializeCartItemFormControls(): void {
    const cartItems = this.cartService.cartItems();

    // 清空現有的購物車表單陣列
    const cartItemsFormArray = this.form.get('cartItems') as FormArray;
    cartItemsFormArray.clear();

    // 為每個購物車項目建立 FormGroup 並加入 FormArray
    cartItems.forEach((item) => {
      const itemFormGroup = new FormGroup({
        productId: new FormControl(item.product.id),
        productName: new FormControl(item.product.name),
        quantity: new FormControl(item.quantity),
        price: new FormControl(item.product.price),
        totalPrice: new FormControl(item.totalPrice),
      });
      cartItemsFormArray.push(itemFormGroup);
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
      // 更新 cartService
      this.cartService.updateQuantity(productId, quantity);
      // 重新載入表單資料
      this.initializeCartItemFormControls();
    }
  }

  removeItem(productId: number): void {
    // 更新 cartService
    this.cartService.removeFromCart(productId);
    // 重新載入表單資料
    this.initializeCartItemFormControls();
  }

  // 取得特定購物車項目的 FormGroup
  getCartItemFormGroup(index: number): FormGroup {
    const cartItemsFormArray = this.form.get('cartItems') as FormArray;
    return cartItemsFormArray.at(index) as FormGroup;
  }

  // 取得購物車項目的 FormArray
  get cartItemsFormArray(): FormArray {
    return this.form.get('cartItems') as FormArray;
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
