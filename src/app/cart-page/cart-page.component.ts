import { CurrencyPipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit, effect } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart-item';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);

  form = new FormGroup({
    name: new FormControl<string | null>(null, { validators: [Validators.required] }),
    address: new FormControl<string | null>(null, { validators: [Validators.required] }),
    tel: new FormControl<string | null>(null, { validators: [Validators.required] }),
    cartItems: new FormArray<FormGroup>([]),
  });

  constructor() {
    // 監聽購物車變化，同步表單
    effect(() => {
      // 只有當購物車項目數量發生變化時才重建表單
      const cartItemsLength = this.cartService.cartItems().length;
      if (this.cartItemsFormArray.length !== cartItemsLength) {
        this.syncCartItemsToForm();
      }
    });
  }

  ngOnInit(): void {
    this.syncCartItemsToForm();
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

  get cartItemsFormArray(): FormArray<FormGroup> {
    return this.form.get('cartItems') as FormArray<FormGroup>;
  }

  private syncCartItemsToForm(): void {
    const cartItems = this.cartService.cartItems();
    const currentFormArray = this.cartItemsFormArray;

    if (currentFormArray.length === cartItems.length) {
      cartItems.forEach((item, index) => {
        const formGroup = currentFormArray.at(index);
        formGroup.get('productId')?.setValue(item.product.id);
        formGroup.get('productName')?.setValue(item.product.name);
        formGroup.get('price')?.setValue(item.product.price);
        const currentFormQuantity = formGroup.get('quantity')?.value;
        if (currentFormQuantity !== item.quantity) {
          formGroup.get('quantity')?.setValue(item.quantity);
        }
      });
    } else {
      while (currentFormArray.length !== 0) {
        currentFormArray.removeAt(0);
      }

      cartItems.forEach((item) => {
        const itemFormGroup = new FormGroup({
          productId: new FormControl(item.product.id),
          productName: new FormControl(item.product.name),
          price: new FormControl(item.product.price),
          quantity: new FormControl(item.quantity),
        });
        currentFormArray.push(itemFormGroup);
      });
    }
  }

  updateQuantity(index: number): void {
    const formGroup = this.cartItemsFormArray.at(index);
    const productId = formGroup.get('productId')?.value;
    const quantity = formGroup.get('quantity')?.value;

    if (productId && quantity && quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    } else if (productId && (!quantity || quantity <= 0)) {
      formGroup.get('quantity')?.setValue(1);
      this.cartService.updateQuantity(productId, 1);
    }
  }

  removeItem(index: number): void {
    const formGroup = this.cartItemsFormArray.at(index);
    const productId = formGroup.get('productId')?.value;

    if (productId) {
      this.cartService.removeFromCart(productId);
    }
  }

  submitOrder(): void {
    if (this.form.valid) {
      alert('訂單已送出！');
      this.cartService.clearCart();
      this.form.reset();
      this.router.navigate(['/']);
    }
  }
}
