import { ProductService } from './../services/product.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product';
import { ProductCardListComponent } from '../product-card-list/product-card-list.component';

@Component({
  selector: 'app-product-page',
  imports: [ProductCardListComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent implements OnInit {
  private router = inject(Router);

  private ProductService = inject(ProductService);

  products: Product[] = [];

  ngOnInit(): void {
    this.products = this.ProductService.getList();
  }

  onAddToCart(product: Product): void {
    this.router.navigate(['product', 'cart', product.name]);
  }

  onView(product: Product): void {
    console.log('onView', product);
    this.router.navigate(['product', 'view', product.name]);
  }
}
