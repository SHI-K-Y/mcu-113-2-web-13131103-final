import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Product } from '../models/product';
import { PaginationComponent } from '../pagination/pagination.component';
import { ProductCardListComponent } from '../product-card-list/product-card-list.component';
import { ProductService } from './../services/product.service';
import { ProductRemoteService } from './../services/product-remote.service'; // Import ProductRemoteService

@Component({
  selector: 'app-product-page',
  imports: [ReactiveFormsModule, PaginationComponent, ProductCardListComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent {
  private router = inject(Router);

  // Ensure ProductService is provided as ProductRemoteService in DI config
  private productService = inject(ProductService); // Corrected casing: ProductService -> productService

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
    defaultValue: { data: [], count: 0 } as { data: Product[]; count: number }, // Added type assertion for defaultValue
    loader: ({ request }) => {
      const { pageIndex, pageSize, name } = request;
      return this.productService.getList(name, pageIndex, pageSize); // Corrected casing: ProductService -> productService
    },
  });

  searchName: string | undefined;

  readonly totalCount = computed(() => {
    const value = this.data.value() as { data: Product[]; count: number }; // Added type assertion
    return value.count;
  });

  readonly products = computed(() => {
    const value = this.data.value() as { data: Product[]; count: number }; // Added type assertion
    return value.data;
  });

  onAddToCart(product: Product): void {
    (this.productService as ProductRemoteService).addItemToCartServer(product).subscribe({
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

  onView(product: Product): void {
    this.router.navigate(['product', 'view', product.id]);
  }

  onSearch(): void {
    this.productName.set(this.searchControl.value);
    this.pageIndex.set(1);
    this.refresh$.next();
  }
}
