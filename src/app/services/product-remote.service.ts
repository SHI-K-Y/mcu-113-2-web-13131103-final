import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { Product } from '../models/product';
import { ProductService } from './product.service';

export interface ServerCartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductRemoteService extends ProductService {
  private readonly url = 'http://localhost:3000/products';
  private readonly ordersUrl = 'http://localhost:3000/orders';
  private readonly cartUrl = 'http://localhost:3000/cartItems';

  private readonly httpClient = inject(HttpClient);

  override getById(productId: number): Observable<Product> {
    const url = `${this.url}/${productId}`;
    return this.httpClient.get<Product>(url);
  }

  override getList(name: string | undefined, index: number, size: number): Observable<{ data: Product[]; count: number }> {
    let query = { _page: index, _per_page: size } as { name?: string; _page: number; _per_page: number };
    if (name) query = { ...query, name };
    const params = new HttpParams({ fromObject: query });
    return this.httpClient
      .get<{ data: Product[]; items: number }>(this.url, { params })
      .pipe(map(({ data, items: count }) => ({ data, count })));
  }

  submitOrder(order: any): Observable<any> {
    return this.httpClient.post(this.ordersUrl, order);
  }

  addItemToCartServer(product: Product): Observable<ServerCartItem> {
    const cartUrlWithProduct = `${this.cartUrl}?productId=${product.id}`;
    return this.httpClient.get<ServerCartItem[]>(cartUrlWithProduct).pipe(
      switchMap((items) => {
        if (items.length > 0) {
          const existingCartItem = items[0];
          const newQuantity = existingCartItem.quantity + 1;
          return this.httpClient.patch<ServerCartItem>(`${this.cartUrl}/${existingCartItem.id}`, { quantity: newQuantity });
        } else {
          const newCartItem = {
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: 1,
          };
          return this.httpClient.post<ServerCartItem>(this.cartUrl, newCartItem);
        }
      })
    );
  }

  getCartItems(): Observable<ServerCartItem[]> {
    return this.httpClient.get<ServerCartItem[]>(this.cartUrl);
  }

  updateCartItemQuantity(cartItemId: number, quantity: number): Observable<ServerCartItem> {
    return this.httpClient.patch<ServerCartItem>(`${this.cartUrl}/${cartItemId}`, { quantity });
  }

  removeCartItem(cartItemId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.cartUrl}/${cartItemId}`);
  }
}
