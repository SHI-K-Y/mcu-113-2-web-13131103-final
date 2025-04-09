export class Product {
  constructor(initDate?: Partial<Product>) {
    if (!initDate) return;
    Object.assign(this, initDate);
  }
  id!: number;

  name!: string;

  company!: string;

  authors!: string;

  isDiscounted!: boolean;

  price!: number;

  photoUrl!: string;
}
