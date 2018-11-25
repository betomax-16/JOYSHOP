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
  selectedFilesNames: string[];

  private testConfig: Ng4FilesConfig = {
    acceptExtensions: ['jpeg', 'jpg', 'png'],
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
    this.selectedFilesNames = [];
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
            + Math.random() * 100000000000000000;
    return datetime;
  }

  save() {
    if (this.existImages()) {
      this.productService.insert(this.product).subscribe(product => {
        const idUser = this.tokenService.decodeToken().sub;
        const idProduct = product._id;
        const actions = this.selectedFiles.map(file => this.productService.upload(idUser, idProduct, file.idName, file));
        const results = Promise.all(actions);

        results.then(data => {
          this.showMessage('Producto creado exitosamente.', 3000);
          this.router.navigate(['user/products']);
        });
      }, error => {
        if (error.error.errors) {
          error.error.errors.forEach(err => {
            this.showMessage(err.message, 3000);
          });
        } else {
          this.showMessage(error.message, 3000);
        }
      });
    } else {
      this.showMessage('Necesitas al menos una imagen.', 3000);
    }
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
    this.readURL(this.selectedFiles, this.obtenerFechaHora, this.selectedFilesNames);
    this.product.images = this.selectedFilesNames;
  }

  removeImage(file) {
    this.selectedFiles = Array.from(this.selectedFiles).filter(fileS => fileS !== file);
    this.selectedFilesNames = Array.from(this.selectedFiles).map(fileS => fileS['idName']);
    this.product.images = this.selectedFilesNames;
  }

  readURL(files, fn, arrayIdName) {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function(e) {
        file['url'] = e.target['result'];
        file['idName'] = fn();
        arrayIdName.push(file['idName']);
      };
      reader.readAsDataURL(file);
    });
  }

  existImages() {
    return this.selectedFiles.length > 0;
  }
}
