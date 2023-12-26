import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent {
  productDetail!: Product;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.handleProductDetails();
  }
  handleProductDetails() {
    const productId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProductById(productId).subscribe((data) => {
      this.productDetail = data;
    });
  }

  addToCart() {
    const cartItem = new CartItem(this.productDetail);
    this.cartService.addProductToCart(cartItem);
  }
}
