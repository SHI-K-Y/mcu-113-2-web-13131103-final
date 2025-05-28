import { ProductService } from './../services/product.service';
import { ResolveFn, Router } from '@angular/router';
import { Product } from '../models/product';
import { inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';

export const productResolver: ResolveFn<Product> = (route) => {
  const productService = inject(ProductService);
  const router = inject(Router);
  const id = route.paramMap.get('id')!;

  return productService.getById(+id);
};
