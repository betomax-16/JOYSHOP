import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { TokenService } from '../services/token.service';
// import { ActivatedRoute } from '@angular/router';
// import { Search } from '../models/search';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];

  constructor(private productService: ProductService,
              public notificacionSnackBar: MatSnackBar,
              private tokenService: TokenService,
              private router: Router,
              public dialog: MatDialog) {
    this.products = [];
  }

  ngOnInit() {
    // this.route.queryParams.subscribe(
    //   params => {
    //       const objectSearch = new Search();
    //       // tslint:disable-next-line:forin
    //       for (const key in params) {
    //           objectSearch[key] = params[key];
    //       }
    //       this.search(objectSearch);
    //   }
    // );

    this.productService.getProducts().subscribe(products => {
      const idUser = this.tokenService.decodeToken().sub;
      products.forEach(product => {
        const idProduct = product._id;
        const urls = [];
        for (let index = 0; index < product.images.length; index++) {
          const idImage = product.images[index];
          this.productService.getUrl(idUser, idProduct, idImage).subscribe(url => {
            urls.push(url);
          });
        }
        product['idImage'] = product.images;
        product.images = urls;
      });
      this.products = products;
    }, err => { console.log(err.message); });
  }

  // search(params) {
  //   this.productService.search(params).subscribe(
  //       res => {
  //           console.log(res);
  //       },
  //       err => { console.log( err ); }
  //   );
  // }

  add() {
    this.router.navigate(['user/products/new']);
  }

  update(product: Product) {
    this.router.navigate(['user/products/edit', product._id]);
  }

  delete(product: Product) {
    const dialogRef = this.dialog.open( ModalConfirmComponent,
      {
          width: '300px'
      } );

    dialogRef.afterClosed()
        .subscribe( result => {
            if (result) {
              this.productService.remove(product).subscribe(res => {
                const idUser = this.tokenService.decodeToken().sub;
                product['idImage'].forEach(image => {
                  this.productService.removeImage(idUser, product._id, image);
                });
                // tslint:disable-next-line:triple-equals
                this.products = this.products.filter(productI => productI._id != product._id);
                this.showMessage(res['message'], 3000);
              }, error =>  this.showMessage(error.message, 3000));
            }
        } );
  }

  showMessage(message: string, duration: number) {
    this.notificacionSnackBar.open( message, '', {
      duration: duration,
    } );
  }
}
