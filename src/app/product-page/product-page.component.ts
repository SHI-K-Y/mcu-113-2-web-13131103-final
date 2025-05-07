import { ProductService } from './../services/product.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product';
import { ProductCardListComponent } from '../product-card-list/product-card-list.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-page',
  imports: [PaginationComponent, ProductCardListComponent, FormsModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent implements OnInit {
  private router = inject(Router);

  private ProductService = inject(ProductService);

  pageIndex = 1;

  pageSize = 5;

  totalCount = 0;

  products: Product[] = [];

  searchName: string | undefined;

  ngOnInit(): void {
    this.getProducts();
  }

  onAddToCart(product: Product): void {
    this.router.navigate(['product', 'cart', product.id]);
  }

  onView(product: Product): void {
    this.router.navigate(['product', 'view', product.id]);
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.getProducts();
  }

  onSearch(): void {
    this.pageIndex = 1;
    this.getProducts();
  }

  private getProducts(): void {
    this.ProductService.getList(undefined, this.pageIndex, this.pageSize).subscribe(({ data, count }) => {
      this.products = data;
      this.totalCount = count;
    });
  }
}
