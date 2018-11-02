import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
// import { ActivatedRoute } from '@angular/router';
// import { Search } from '../models/search';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

  product: Product;

  constructor(private productService: ProductService,
              public notificacionSnackBar: MatSnackBar,
              private router: Router) {
    this.product = new Product();
  }

  ngOnInit() {}

  save() {
    this.productService.insert(this.product).subscribe(product => {
      this.showMessage('Product created successfully.', 3000);
      this.router.navigate(['user/products']);
    }, error =>  this.showMessage(error.message, 3000));
  }

  showMessage(message: string, duration: number) {
    this.notificacionSnackBar.open( message, '', {
      duration: duration,
    } );
  }
}
