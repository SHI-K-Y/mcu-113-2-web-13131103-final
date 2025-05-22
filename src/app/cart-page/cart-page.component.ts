import { CurrencyPipe, JsonPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Product } from '../models/product';
import { ProductRemoteService, ServerCartItem } from '../services/product-remote.service';

@Component({
  selector: 'app-cart-page',
  imports: [JsonPipe, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductRemoteService);
  private destroy$ = new Subject<void>();

  form = this.fb.group({
    name: new FormControl<string | null>(null, { validators: [Validators.required] }),
    address: new FormControl<string | null>(null, { validators: [Validators.required] }),
    tel: new FormControl<string | null>(null, { validators: [Validators.required] }),
    items: this.fb.array([]),
  });

  ngOnInit(): void {
    this.loadCartItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCartItems(): void {
    this.productService
      .getCartItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (serverItems: ServerCartItem[]) => {
          this.items.clear();
          serverItems.forEach((serverItem) => {
            const formGroup = this.fb.group({
              cartItemId: [serverItem.id],
              productId: [serverItem.productId],
              productName: [serverItem.productName],
              price: [serverItem.price],
              quantity: [serverItem.quantity, [Validators.required, Validators.min(1)]],
            });
            this.items.push(formGroup);

            formGroup
              .get('quantity')
              ?.valueChanges.pipe(
                takeUntil(this.destroy$),
                debounceTime(500),
                distinctUntilChanged(),
                filter(() => formGroup.get('quantity')?.valid === true) // Only proceed if quantity is valid
              )
              .subscribe((newQuantity) => {
                if (typeof newQuantity === 'number') {
                  this.updateItemQuantity(serverItem.id, newQuantity);
                }
              });
          });
        },
        error: (err) => {
          console.error('Failed to load cart items:', err);
          alert('Failed to load cart. Please try again.');
        },
      });
  }

  updateItemQuantity(cartItemId: number, quantity: number): void {
    this.productService
      .updateCartItemQuantity(cartItemId, quantity)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedItem) => {
          console.log('Item quantity updated on server:', updatedItem);
        },
        error: (err) => {
          console.error('Failed to update item quantity:', err);
          alert('Failed to update quantity. Please try again.');
          this.loadCartItems();
        },
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

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  createItemFormGroup(product: Product, quantity: number = 1): FormGroup {
    return this.fb.group({
      productId: [product.id],
      productName: [product.name],
      price: [product.price],
      quantity: [quantity, [Validators.required, Validators.min(1)]],
    });
  }

  addItemToCart(product: Product): void {
    const itemsArray = this.items;
    const existingItemIndex = itemsArray.controls.findIndex((control) => control.get('productId')?.value === product.id);

    if (existingItemIndex !== -1) {
      const existingItem = itemsArray.at(existingItemIndex) as FormGroup;
      const currentQuantity = existingItem.get('quantity')?.value;
      existingItem.get('quantity')?.setValue(currentQuantity + 1);
    } else {
      itemsArray.push(this.createItemFormGroup(product));
    }
  }

  removeItem(index: number): void {
    const itemFormGroup = this.items.at(index) as FormGroup;
    const cartItemId = itemFormGroup.get('cartItemId')?.value;

    if (cartItemId) {
      this.productService
        .removeCartItem(cartItemId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('Item removed from server cart');
            this.items.removeAt(index);
          },
          error: (err) => {
            console.error('Failed to remove item from server cart:', err);
            alert('Failed to remove item. Please try again.');
          },
        });
    } else {
      this.items.removeAt(index);
      console.warn('Removed item locally that had no cartItemId.');
    }
  }

  getSubtotal(itemIndex: number): number {
    const item = this.items.at(itemIndex) as FormGroup;
    if (item) {
      const price = item.get('price')?.value;
      const quantity = item.get('quantity')?.value;
      return price * quantity;
    }
    return 0;
  }

  getTotal(): number {
    return this.items.controls.reduce((acc, control) => {
      const item = control as FormGroup;
      const price = item.get('price')?.value;
      const quantity = item.get('quantity')?.value;
      return acc + price * quantity;
    }, 0);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const orderPayload = {
        name: this.name.value,
        address: this.address.value,
        tel: this.tel.value,
        items: this.items.value.map((item: any) => ({
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: this.getTotal(),
        orderDate: new Date().toISOString(),
      };

      this.productService
        .submitOrder(orderPayload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            alert('訂單已成功送出');
            this.clearServerCart();
          },
          error: (err) => {
            console.error('訂單送出失敗:', err);
            alert('訂單送出失敗，請稍後再試');
          },
        });
    }
  }

  clearServerCart(): void {
    const cartItemControls = this.items.controls as FormGroup[];
    const cartItemIds = cartItemControls.map((control) => control.get('cartItemId')?.value).filter((id) => id != null);

    if (cartItemIds.length === 0) {
      this.resetCartPageUI();
      return;
    }

    const deleteRequests = cartItemIds.map((id) => this.productService.removeCartItem(id));
    forkJoin(deleteRequests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Server cart cleared');
          this.resetCartPageUI();
        },
        error: (err) => {
          console.error('Failed to clear server cart, but order was submitted:', err);
          this.resetCartPageUI();
        },
      });
  }

  resetCartPageUI(): void {
    this.form.reset();
    this.items.clear();
    this.router.navigate(['/products']);
  }
}
