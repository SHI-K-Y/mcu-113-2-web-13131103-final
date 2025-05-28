import { CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product';
import { ProductService } from './../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-detail-page',
  imports: [CurrencyPipe],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent {
  readonly product = input.required<Product>();

  readonly router = inject(Router);

  readonly productService = inject(ProductService);

  readonly cartService = inject(CartService);

  onBack(): void {
    this.router.navigate(['products']);
  }
  onAddToCart(): void {
    this.cartService.addToCart(this.product());
  }
}
