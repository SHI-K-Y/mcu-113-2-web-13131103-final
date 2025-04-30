import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _data: Product[] = [
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

  getList(): Product[] {
    return this._data;
  }
}
