import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  product: Product;

  constructor(private productService: ProductService,
              public notificacionSnackBar: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute) {
              this.product = new Product();
              }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
          const idProduct = params['id'];
          this.productService.getProduct(idProduct).subscribe(product => {
            this.product = product;
          });
      }
    );
  }

  save() {
    this.productService.update(this.product).subscribe(product => {
      this.showMessage('Product updated successfully.', 3000);
      this.router.navigate(['user/products']);
    }, error =>  this.showMessage(error.message, 3000));
  }

  showMessage(message: string, duration: number) {
    this.notificacionSnackBar.open( message, '', {
      duration: duration,
    } );
  }
}
