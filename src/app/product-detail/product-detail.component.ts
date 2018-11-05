import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product: Product;
  listFilesFirebase: string[];
  imageSelected: string;
  index = 0;

  constructor(private productService: ProductService,
              public notificacionSnackBar: MatSnackBar,
              private route: ActivatedRoute) {
        this.product = new Product();
        this.listFilesFirebase = [];
        this.imageSelected = '';
    }

  ngOnInit() {
    this.route.params.subscribe(
        params => {
          const idProduct = params.id;
          this.productService.getPublicProduct(idProduct).subscribe(product => {
            this.product = product;
            const idUser = this.product.idUser;
            for (let index = 0; index < product.images.length; index++) {
              const idImage = product.images[index];
              this.productService.getUrl(idUser, idProduct, idImage).subscribe(url => {
                this.listFilesFirebase.push(url);
                this.imageSelected = this.listFilesFirebase[0];
              });
            }
          });
        }
      );
  }

  before() {
    const limit = this.listFilesFirebase.length - 1;
    this.index = this.index <= 0 ? limit : this.index - 1;
    this.imageSelected = this.listFilesFirebase[this.index];
  }

  next() {
    const limit = this.listFilesFirebase.length - 1;
    this.index = this.index >= limit ? 0 : this.index + 1;
    this.imageSelected = this.listFilesFirebase[this.index];
  }

  onlyImage() {
      return this.listFilesFirebase.length === 0 || this.listFilesFirebase.length === 1;
  }
}
