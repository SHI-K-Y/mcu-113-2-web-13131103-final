import { ProductService } from './../services/product.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product';
import { ProductCardListComponent } from '../product-card-list/product-card-list.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, startWith, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-product-page',
  imports: [PaginationComponent, ProductCardListComponent, FormsModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent implements OnInit {
  private router = inject(Router);

  private ProductService = inject(ProductService);

  private readonly pageIndex$ = new BehaviorSubject(1);
  get pageIndex() {
    return this.pageIndex$.value;
  }
  set pageIndex(value: number) {
    this.pageIndex$.next(value);
  }

  private readonly refresh$ = new Subject<void>();

  pageSize = 5;

  totalCount = 0;

  products: Product[] = [];

  searchName: string | undefined;

  ngOnInit(): void {
    combineLatest([
      this.pageIndex$.pipe(tap((value) => console.log('page index', value))),
      this.refresh$.pipe(
        startWith(undefined),
        tap(() => console.log('refresh'))
      ),
    ])
      .pipe(switchMap(() => this.ProductService.getList(this.searchName, this.pageIndex, this.pageSize)))
      .subscribe(({ data, count }) => {
        this.products = data;
        this.totalCount = count;
      });
  }

  onAddToCart(product: Product): void {
    this.router.navigate(['product', 'cart', product.id]);
  }

  onView(product: Product): void {
    this.router.navigate(['product', 'view', product.id]);
  }

  onSearch(): void {
    this.pageIndex = 1;
    this.refresh$.next();
  }
}
