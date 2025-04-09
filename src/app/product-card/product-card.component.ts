import { CurrencyPipe } from '@angular/common';
import { booleanAttribute, Component, HostBinding, Input, numberAttribute } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input({ required: true, transform: numberAttribute })
  id!: number;

  @Input()
  productName!: string;

  @Input()
  author!: string;

  @Input()
  company!: string;

  @Input({ transform: booleanAttribute })
  isDiscounted!: boolean;

  @Input({ transform: numberAttribute })
  price!: number;

  @Input()
  photoUrl!: string;

  @HostBinding('class')
  class = 'app-product-card';
}
