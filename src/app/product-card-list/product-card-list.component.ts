import { Component } from '@angular/core';

import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-card-list',
  imports: [ProductCardComponent],
  templateUrl: './product-card-list.component.html',
  styleUrl: './product-card-list.component.scss',
})
export class ProductCardListComponent {
  productName = 'A 產品';
  author = '作者 A、作者 B、作者 C';
  company = '博碩文化';

  isDiscounted = true;

  photoUrl = 'https://api.fnkr.net/testimg/200x200/DDDDDD/999999/?text=img';

  price = 1580;
}
