import { CurrencyPipe } from '@angular/common';
import { Component, HostBinding, numberAttribute, input, booleanAttribute, output } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  readonly productName = input.required<string>();

  readonly authors = input<string[]>();

  readonly company = input<string>();

  readonly isDiscounted = input.required<boolean, string | boolean>({ transform: booleanAttribute });

  readonly price = input<number, string | number>(0, { transform: numberAttribute });

  readonly photoUrl = input<string>();

  readonly addToCart = output<void>();

  readonly view = output<void>();

  @HostBinding('class')
  class = 'app-product-card';
}
