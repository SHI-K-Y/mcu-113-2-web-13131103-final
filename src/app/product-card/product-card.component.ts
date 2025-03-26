import { Component } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  productName = 'A 產品';
  author = '作者 A、作者 B、作者 C';
  company = '博碩文化';

  isDiscounted = true;

  photoUrl = 'https://api.fnkr.net/testimg/200x200/DDDDDD/999999/?text=img';

  onSetDisplay(isDiscounted: boolean): void {
    this.isDiscounted = isDiscounted;
  }
}
