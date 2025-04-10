export class Product {
  constructor(initDate?: Partial<Product>) {
    if (!initDate) return;
    Object.assign(this, initDate);
  }

  name!: string;

  company!: string;

  authors!: string[];

  isDiscounted!: boolean;

  price!: number;

  photoUrl!: string;
}
