import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly url = 'http://localhost:3000/orders';
  private readonly httpClient = inject(HttpClient);

  submitOrder(order: Order): Observable<Order> {
    return this.httpClient.post<Order>(this.url, order);
  }
}
