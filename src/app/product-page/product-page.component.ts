import { ProductService } from './../services/product.service';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product';
import { ProductCardListComponent } from '../product-card-list/product-card-list.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, startWith, Subject, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-page',
  imports: [PaginationComponent, ProductCardListComponent, FormsModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent {
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

  private readonly data$ = combineLatest([
    this.pageIndex$.pipe(tap((value) => console.log('page index', value))),
    this.refresh$.pipe(
      startWith(undefined),
      tap(() => console.log('refresh'))
    ),
  ]).pipe(switchMap(() => this.ProductService.getList(undefined, this.pageIndex, this.pageSize)));

  private readonly data = toSignal(this.data$, { initialValue: { data: [], count: 0 } });

  searchName: string | undefined;

  readonly totalCount = computed(() => {
    const { count } = this.data();
    return count;
  });

  readonly products = computed(() => {
    const { data } = this.data();
    return data;
  });

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
