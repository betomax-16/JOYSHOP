import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { Commentary } from '../models/commentary';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalImageComponent } from '../modal-image/modal-image.component';
import { CommentaryService } from '../services/commentary.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit  {

  oldCommentaries: Commentary[];
  commentary: Commentary;
  product: Product;
  listFilesFirebase: string[];
  imageSelected: string;
  index = 0;

  constructor(private productService: ProductService,
              private commentaryService: CommentaryService,
              private tokenService: TokenService,
              public notificacionSnackBar: MatSnackBar,
              public dialog: MatDialog,
              private route: ActivatedRoute) {
        this.commentary = new Commentary();
        this.product = new Product();
        this.listFilesFirebase = [];
        this.imageSelected = '';
        this.oldCommentaries = [];
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
            this.commentaryService.getCommentariesByProduct(this.product._id).subscribe(commentaries => {
              this.oldCommentaries = commentaries.reverse();
            });
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

  showImage() {
    const dialogRef = this.dialog.open( ModalImageComponent, { panelClass: 'modalImage' });
    dialogRef.componentInstance.listFilesFirebase = this.listFilesFirebase;
    dialogRef.componentInstance.imageSelected = this.imageSelected;
    dialogRef.componentInstance.index = this.index;
  }

  saveCommentary() {
    const token = this.tokenService.decodeToken();
    this.commentary.idProduct = this.product._id;
    this.commentary.idUser = token.sub;
    this.commentaryService.create(this.commentary).subscribe(commentary => {
      this.oldCommentaries.splice(0, 0, commentary);
      this.commentary = new Commentary();
    });
  }

  isLogged() {
    return this.tokenService.decodeToken();
  }
}
