import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, numberAttribute, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product';
import { ProductService } from './../services/product.service';

@Component({
  selector: 'app-product-detail-page',
  imports: [CurrencyPipe],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent implements OnInit {
  id = input.required<number, string | number>({ transform: numberAttribute });

  product!: Product;

  readonly router = inject(Router);

  readonly productService = inject(ProductService);

  ngOnInit(): void {
    this.productService.getById(this.id()).subscribe((product) => (this.product = product));
  }

  onBack(): void {
    this.router.navigate(['products']);
  }

  onAddToCart(): void {
    this.router.navigate(['products', 'cart']);
  }
}
