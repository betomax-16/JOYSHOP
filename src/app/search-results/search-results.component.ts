import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatDialog, PageEvent } from '@angular/material';
import { TokenService } from '../services/token.service';
import { UploadService } from '../services/upload.service';
import { Search } from '../models/search';
import { ModalFilterComponent } from '../modal-filter/modal-filter.component';
import { MatPaginatorIntl } from '@angular/material';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  products: Product[];
  totalResults = 0;
  limit = 10;
  offset = 0;

  constructor(private productService: ProductService,
              public notificacionSnackBar: MatSnackBar,
              private tokenService: TokenService,
              private uploadService: UploadService,
              private router: Router,
              private route: ActivatedRoute,
              private matPaginatorIntl: MatPaginatorIntl,
              public dialog: MatDialog) {
    this.products = [];
  }

  ngOnInit() {
    this.matPaginatorIntl.itemsPerPageLabel = 'Artículos por página:';
    this.matPaginatorIntl.nextPageLabel = 'Siguiente página';
    this.matPaginatorIntl.lastPageLabel = 'Página anterior';
    this.matPaginatorIntl.firstPageLabel = 'Primera Página';
    this.matPaginatorIntl.lastPageLabel = 'Última Página';
    this.matPaginatorIntl.getRangeLabel = this.spanishRangeLabel;
    this.route.queryParams.subscribe(
      params => {
          const objectSearch = new Search();
          // tslint:disable-next-line:forin
          for (const key in params) {
              objectSearch[key] = params[key];
          }
          this.search(objectSearch);
          this.limit = objectSearch.limit != null ? objectSearch.limit : 10;
          this.offset = objectSearch.offset != null ? objectSearch.offset / objectSearch.limit : 0;
      }
    );
  }

  search(params) {
    this.productService.search(params).subscribe(
        res => {
          this.products = res['products'];
          this.totalResults = res['count'];
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

  goDetail(product: Product) {
    this.router.navigate(['product', product._id]);
  }

  movePage(event: PageEvent) {
    this.route.queryParams.subscribe(
      params => {
          const objectSearch = new Search();
          // tslint:disable-next-line:forin
          for (const key in params) {
              objectSearch[key] = params[key];
          }
          objectSearch.limit = event.pageSize;
          objectSearch.offset = event.pageSize * event.pageIndex;
          this.router.navigate(['search'], { queryParams: objectSearch });
      }
    );
  }

  filter() {
    const dialogRef = this.dialog.open( ModalFilterComponent, { panelClass: 'modalFilter' });
  }

  spanishRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) { return `0 de ${length}`; }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  }
}
