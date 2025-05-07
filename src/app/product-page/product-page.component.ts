import { ProductService } from './../services/product.service';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product';
import { ProductCardListComponent } from '../product-card-list/product-card-list.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, startWith, Subject, switchMap, tap } from 'rxjs';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-page',
  imports: [PaginationComponent, ProductCardListComponent, FormsModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent {
  private router = inject(Router);

  private ProductService = inject(ProductService);

  readonly pageIndex = signal(1);

  readonly pageSize = signal(5);

  readonly searchNameSignal = signal<string | undefined>(undefined);

  private readonly refresh$ = new Subject<void>();

  private readonly data = rxResource({
    request: () => ({
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
      searchName: this.searchNameSignal(),
    }),
    defaultValue: { data: [], count: 0 },
    loader: ({ request }) => {
      const { pageIndex, pageSize, searchName } = request;
      return this.ProductService.getList(searchName, pageIndex, pageSize);
    },
  });

  searchName: string | undefined;

  readonly totalCount = computed(() => {
    const { count } = this.data.value();
    return count;
  });

  readonly products = computed(() => {
    const { data } = this.data.value();
    return data;
  });

  onAddToCart(product: Product): void {
    this.router.navigate(['product', 'cart', product.id]);
  }

  onView(product: Product): void {
    this.router.navigate(['product', 'view', product.id]);
  }

  onSearch(): void {
    this.searchNameSignal.set(this.searchName);
    this.pageIndex.set(1);
    this.refresh$.next();
  }
}
