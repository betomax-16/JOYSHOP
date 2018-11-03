import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { TokenService } from '../services/token.service';
import { UploadService } from '../services/upload.service';
import { Search } from '../models/search';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  products: Product[];

  constructor(private productService: ProductService,
              public notificacionSnackBar: MatSnackBar,
              private tokenService: TokenService,
              private uploadService: UploadService,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog) {
    this.products = [];
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
          const objectSearch = new Search();
          // tslint:disable-next-line:forin
          for (const key in params) {
              objectSearch[key] = params[key];
          }
          this.search(objectSearch);
      }
    );
  }

  search(params) {
    this.productService.search(params).subscribe(
        res => {
          this.products = res['products'];
          this.products.forEach(product => {
            const idUser = product.idUser;
            const idProduct = product._id;
            const urls = [];
            for (let index = 0; index < product.images.length; index++) {
              const idImage = product.images[index];
              this.productService.getUrl(idUser, idProduct, idImage).subscribe(url => {
                urls.push(url);
              });
            }
            product.images = urls;
            this.uploadService.getUrl(product.idUser).subscribe(url => {
              product.user['image'] = url;
            });
          });
        },
        err => { console.log( err ); }
    );
  }

  existResults() {
    return this.products.length > 0;
  }

  goArtist(id) {
    this.router.navigate(['artist', id]);
  }
}
