import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Ng4FilesService } from '../ng4-files/services/ng4-files.service';
import { Ng4FilesConfig } from '../ng4-files/declarations/ng4-files-config';
import { Ng4FilesSelected, Ng4FilesStatus } from '../ng4-files/declarations/ng4-files-selected';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

  product: Product;
  selectedFiles;

  private testConfig: Ng4FilesConfig = {
    acceptExtensions: ['jpej', 'jpg', 'png'],
    maxFilesCount: 5,
    maxFileSize: 5120000,
    totalFilesSize: 10120000
  };

  constructor(private productService: ProductService,
              public notificacionSnackBar: MatSnackBar,
              private ng4FilesService: Ng4FilesService,
              private tokenService: TokenService,
              private router: Router) {
    this.product = new Product();
    this.selectedFiles = [];
  }

  ngOnInit() {
    this.ng4FilesService.addConfig(this.testConfig);
  }

  obtenerFechaHora() {
    const currentdate = new Date();
    const datetime = '' + currentdate.getDate()
            + (currentdate.getMonth() + 1)
            + currentdate.getFullYear()
            + currentdate.getHours()
            + currentdate.getMinutes()
            + currentdate.getSeconds()
            + currentdate.getMilliseconds()
            + Math.random();
    return datetime;
  }

  save() {
    this.productService.insert(this.product).subscribe(product => {
      const idUser = this.tokenService.decodeToken().sub;
      const idProduct = product._id;
      this.selectedFiles.forEach(file => {
        const idFile = this.obtenerFechaHora();
        this.productService.upload(idUser, idProduct, idFile, file);
      });
      this.showMessage('Product created successfully.', 3000);
      this.router.navigate(['user/products']);
    }, error =>  this.showMessage(error.message, 3000));
  }

  showMessage(message: string, duration: number) {
    this.notificacionSnackBar.open( message, '', {
      duration: duration,
    } );
  }

  filesSelect(selectedFiles: Ng4FilesSelected): void {
    if (selectedFiles.status !== Ng4FilesStatus.STATUS_SUCCESS) {
      this.selectedFiles = selectedFiles.status;
      return;
    }
    if (this.selectedFiles.length) {
      selectedFiles.files.forEach(file => {
        this.selectedFiles.push(file);
      });
    } else {
      this.selectedFiles = selectedFiles.files;
    }
    this.readURL(this.selectedFiles);
    console.log(this.selectedFiles);
    // this.selectedFiles = Array.from(selectedFiles.files).map(file => file.name);
  }

  removeImage(file) {
    this.selectedFiles = Array.from(this.selectedFiles).filter(fileS => fileS !== file);
  }

  readURL(files) {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function(e) {
        file['url'] = e.target['result'];
      };
      reader.readAsDataURL(file);
    });
  }
}
