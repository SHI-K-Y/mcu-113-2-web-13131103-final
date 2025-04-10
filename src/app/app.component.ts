import { Component } from '@angular/core';

import { ProductCardListComponent } from './product-card-list/product-card-list.component';
import { Product } from './models/product';

@Component({
  selector: 'app-root',
  imports: [ProductCardListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  products: Product[] = [];
  setEmptyData(): void {
    this.products = [];
  }
  setHasData(): void {
    this.products = [
      new Product({
        name: 'A 產品',
        authors: ['作者 A', '作者 B', '作者 C'],
        company: '博碩文化',
        isDiscounted: true,
        photoUrl: 'https://api.fnkr.net/testimg/200x200/DDDDDD/999999/?text=img',
        price: 1580,
      }),
      new Product({
        name: 'B 產品',
        authors: ['作者 A', '作者 B', '作者 C'],
        company: '博碩文化',
        isDiscounted: false,
        photoUrl: 'https://api.fnkr.net/testimg/200x200/DDDDDD/999999/?text=img',
        price: 1580,
      }),
      new Product({
        name: 'C 產品',
        authors: ['作者 A', '作者 B', '作者 C'],
        company: '博碩文化',
        isDiscounted: true,
        photoUrl: 'https://api.fnkr.net/testimg/200x200/DDDDDD/999999/?text=img',
        price: 1580,
      }),
      new Product({
        name: 'D 產品',
        authors: ['作者 A', '作者 B', '作者 C'],
        company: '博碩文化',
        isDiscounted: false,
        photoUrl: 'https://api.fnkr.net/testimg/200x200/DDDDDD/999999/?text=img',
        price: 1580,
      }),
      new Product({
        name: 'E 產品',
        authors: ['作者 A', '作者 B', '作者 C'],
        company: '博碩文化',
        isDiscounted: true,
        photoUrl: 'https://api.fnkr.net/testimg/200x200/DDDDDD/999999/?text=img',
        price: 1580,
      }),
    ];
  }
}
