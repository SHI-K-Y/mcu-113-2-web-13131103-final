import { HttpClient, HttpParams } from '@angular/common/http';
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
  override getById(productId: number): Observable<Product> {
    const params = new HttpParams().set('id', productId.toString());
    return this.httpClient.get<Product[]>(this.url, { params }).pipe(
      map((products) => {
        const product = products[0];
        if (!product || !product.isShow) {
          throw new Error('Product is not available');
        }
        return product;
      })
    );
  }
  override getList(name: string | undefined, index: number, size: number): Observable<{ data: Product[]; count: number }> {
    let query = { _page: index, _per_page: size, isShow: true } as { name?: string; _page: number; _per_page: number; isShow: boolean };
    if (name) query = { ...query, name };
    const params = new HttpParams({ fromObject: query });
    return this.httpClient
      .get<{ data: Product[]; items: number }>(this.url, { params })
      .pipe(map(({ data, items: count }) => ({ data, count })));
  }
}
