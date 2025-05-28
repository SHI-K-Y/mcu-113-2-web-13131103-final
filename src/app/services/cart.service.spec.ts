import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../models/product';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add product to cart', () => {
    const product = new Product({
      id: 1,
      name: 'Test Product',
      price: 100,
      authors: ['Test Author'],
      company: 'Test Company',
      isDiscounted: false,
      photoUrl: 'test.jpg',
    });

    service.addToCart(product);
    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].product.id).toBe(1);
    expect(service.cartItems()[0].quantity).toBe(1);
  });

  it('should increase quantity when adding same product', () => {
    const product = new Product({
      id: 1,
      name: 'Test Product',
      price: 100,
      authors: ['Test Author'],
      company: 'Test Company',
      isDiscounted: false,
      photoUrl: 'test.jpg',
    });

    service.addToCart(product);
    service.addToCart(product);
    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].quantity).toBe(2);
  });

  it('should remove product from cart', () => {
    const product = new Product({
      id: 1,
      name: 'Test Product',
      price: 100,
      authors: ['Test Author'],
      company: 'Test Company',
      isDiscounted: false,
      photoUrl: 'test.jpg',
    });

    service.addToCart(product);
    service.removeFromCart(1);
    expect(service.cartItems().length).toBe(0);
  });

  it('should calculate total amount correctly', () => {
    const product1 = new Product({
      id: 1,
      name: 'Test Product 1',
      price: 100,
      authors: ['Test Author'],
      company: 'Test Company',
      isDiscounted: false,
      photoUrl: 'test.jpg',
    });

    const product2 = new Product({
      id: 2,
      name: 'Test Product 2',
      price: 200,
      authors: ['Test Author'],
      company: 'Test Company',
      isDiscounted: false,
      photoUrl: 'test.jpg',
    });

    service.addToCart(product1, 2);
    service.addToCart(product2, 1);
    expect(service.getTotalAmount()).toBe(400); // 100*2 + 200*1
  });
});
