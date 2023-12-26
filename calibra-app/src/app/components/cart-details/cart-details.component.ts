import { Component } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
})
export class CartDetailsComponent {
  cartItems: CartItem[] = [];
  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {}
  ngOnInit(): void {
    this.getCartItems();
    console.log('price', this.totalPrice);
  }

  getCartItems() {
    this.cartItems = this.cartService.cartItems;

    //subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      (data) => (this.totalPrice = +data.toFixed(2))
    );

    //subscribe to the cart quantity
    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );

    //compute cart total price and quantity
    this.cartService.computeCartTotals();
  }

  incrementItem(theCartItem: CartItem) {
    this.cartService.addProductToCart(theCartItem);
  }
  decrementItem(theCartItem: CartItem) {
    this.cartService.decrementProduct(theCartItem);
  }
  removeItem(theCartItem: CartItem) {
    this.cartService.remove(theCartItem);
  }
}
