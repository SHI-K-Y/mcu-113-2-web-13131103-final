import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Product } from '../models/product';
import { PaginationComponent } from '../pagination/pagination.component';
import { ProductCardListComponent } from '../product-card-list/product-card-list.component';
import { ProductService } from './../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-page',
  imports: [ReactiveFormsModule, PaginationComponent, ProductCardListComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent {
  private router = inject(Router);

  private ProductService = inject(ProductService);

  private cartService = inject(CartService);

  private destroyRef = inject(DestroyRef);

  readonly searchControl = new FormControl<string | undefined>(undefined, { nonNullable: true });

  readonly productName = signal<string | undefined>(undefined);

  readonly pageIndex = signal(1);

  readonly pageSize = signal(5);

  private readonly refresh$ = new Subject<void>();

  private readonly data = rxResource({
    request: () => ({
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
      name: this.productName(),
    }),
    defaultValue: { data: [], count: 0 },
    loader: ({ request }) => {
      const { pageIndex, pageSize, name } = request;
      return this.ProductService.getList(name, pageIndex, pageSize);
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
    this.cartService.addToCart(product);
  }

  onView(product: Product): void {
    this.router.navigate(['product', 'view', product.id]);
  }

  onSearch(): void {
    this.productName.set(this.searchControl.value);
    this.pageIndex.set(1);
    this.refresh$.next();
  }
}
