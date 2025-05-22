import { CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { ProductRemoteService } from '../services/product-remote.service';

@Component({
  selector: 'app-product-detail-page',
  imports: [CurrencyPipe],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent {
  readonly product = input.required<Product>();

  readonly router = inject(Router);
  private productService = inject(ProductService);

  onBack(): void {
    this.router.navigate(['products']);
  }

  onAddToCart(): void {
    (this.productService as ProductRemoteService).addItemToCartServer(this.product()).subscribe({
      next: (cartItem) => {
        console.log('Item added/updated in server cart:', cartItem);
        this.router.navigate(['cart']);
      },
      error: (err) => {
        console.error('Failed to add item to server cart:', err);
        alert('Failed to add item to cart. Please try again.');
      },
    });
  }
}
