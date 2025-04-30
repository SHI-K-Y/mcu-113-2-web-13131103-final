import { Component, inject } from '@angular/core';
import { Product } from '../models/product';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail-page',
  imports: [CurrencyPipe],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent {
  product = new Product({
    name: 'I 產品',
    authors: ['作者 A', '作者 B', '作者 C'],
    company: '博碩文化',
    isDiscounted: false,
    photoUrl: 'https://api.fnkr.net/testimg/200x200/DDDDDD/999999/?text=img',
    price: 1580,
  });

  readonly router = inject(Router);

  onBack(): void {
    this.router.navigate(['products']);
  }

  onAddToCart(): void {
    this.router.navigate(['products', 'cart']);
  }
}
