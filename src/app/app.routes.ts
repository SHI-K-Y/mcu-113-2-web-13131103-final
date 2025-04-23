import { Routes } from '@angular/router';
import { ProductPageComponent } from './product-page/product-page.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { ProductDetailPageComponent } from './product-detail-page/product-detail-page.component';
import { ProductFormPageComponent } from './product-form-page/product-form-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: 'products', component: ProductPageComponent },
  { path: 'product/view/:name', component: ProductDetailPageComponent },
  { path: 'product/form/:name', component: ProductFormPageComponent },
  { path: 'cart', component: CartPageComponent },
];
