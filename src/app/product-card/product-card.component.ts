import { CurrencyPipe } from '@angular/common';
import { Component, HostBinding, numberAttribute, input, model } from '@angular/core';

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

  readonly isDiscounted = model.required<boolean>();

  readonly price = input<number, string | number>(0, { transform: numberAttribute });

  readonly photoUrl = input<string>();

  @HostBinding('class')
  class = 'app-product-card';
}
