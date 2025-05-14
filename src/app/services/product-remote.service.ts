import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class ProductRemoteService extends ProductService {
  private readonly url = 'http://localhost:3000/products';

  private readonly httpClient = inject(HttpClient);

  override getList(name: string | undefined, index: number, size: number): Observable<{ data: Product[]; count: number }> {
    return this.httpClient.get<Product[]>(this.url).pipe(map((data) => ({ data, count: data.length })));
  }
}
