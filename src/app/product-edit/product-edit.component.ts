import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Ng4FilesService, Ng4FilesConfig, Ng4FilesSelected, Ng4FilesStatus } from '../ng4-files';
import { TokenService } from '../services/token.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  product: Product;
  selectedFilesLocales;
  selectedFilesDeleteFirabase: ImageFirebase[];
  listFilesFirebase: ImageFirebase[];
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
              private router: Router,
              private route: ActivatedRoute) {
    this.product = new Product();
    this.selectedFilesLocales = [];
    this.selectedFilesNames = [];
    this.selectedFilesDeleteFirabase = [];
    this.listFilesFirebase = [];
  }

  ngOnInit() {
    this.ng4FilesService.addConfig(this.testConfig);
    this.route.params.subscribe(
      params => {
        const idUser = this.tokenService.decodeToken().sub;
        const idProduct = params['id'];
        this.productService.getProduct(idProduct).subscribe(product => {
          this.product = product;
          for (let index = 0; index < product.images.length; index++) {
            const idImage = product.images[index];
            this.productService.getUrl(idUser, idProduct, idImage).subscribe(url => {
              this.listFilesFirebase.push(new ImageFirebase(idImage, url));
            });
          }
        });
      }
    );
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
    // console.log('------------Local---------------');
    // console.log(this.selectedFilesLocales);
    // console.log(this.selectedFilesNames);
    // console.log('------------Firebase---------------');
    // console.log(this.listFilesFirebase);
    // console.log('------------Firebase Delete---------------');
    // console.log(this.selectedFilesDeleteFirabase);
    // console.log('------------BD~s---------------');
    if (this.existImages()) {
      const aux = this.listFilesFirebase.map(image => image.id);
      this.selectedFilesNames = aux.concat(this.selectedFilesNames);
      this.product.images = this.selectedFilesNames;
      const idUser = this.tokenService.decodeToken().sub;

      this.productService.update(this.product).subscribe(product => {
        // tslint:disable-next-line:max-line-length
        const actionsObs = this.selectedFilesDeleteFirabase.map(image => this.productService.removeImage(idUser, this.product._id, image.id));
        if (actionsObs.length) {
          const resultsObs = forkJoin(actionsObs);

          resultsObs.subscribe(results => {
            console.log(results);
            const actions = this.selectedFilesLocales.map(file => this.productService.upload(idUser, this.product._id, file.idName, file));
            if (actions.length) {
              const resultsPro = Promise.all(actions);

              resultsPro.then(data => {
                console.log(data);
                this.showMessage('Product updated successfully.', 3000);
                this.router.navigate(['user/products']);
              });
            } else {
              this.showMessage('Product updated successfully.', 3000);
              this.router.navigate(['user/products']);
            }
          });
        } else {
          const actions = this.selectedFilesLocales.map(file => this.productService.upload(idUser, this.product._id, file.idName, file));
          if (actions.length) {
            const resultsPro = Promise.all(actions);

            resultsPro.then(data => {
              console.log(data);
              this.showMessage('Product updated successfully.', 3000);
              this.router.navigate(['user/products']);
            });
          } else {
            this.showMessage('Product updated successfully.', 3000);
            this.router.navigate(['user/products']);
          }
        }
      }, error =>  this.showMessage(error.message, 3000));
    } else {
      this.showMessage('You need at least one image.', 3000);
    }
  }

  showMessage(message: string, duration: number) {
    this.notificacionSnackBar.open( message, '', {
      duration: duration,
    } );
  }

  filesSelect(selectedFiles: Ng4FilesSelected): void {
    if (selectedFiles.status !== Ng4FilesStatus.STATUS_SUCCESS) {
      this.selectedFilesLocales = selectedFiles.status;
      return;
    }
    if (this.selectedFilesLocales.length) {
      selectedFiles.files.forEach(file => {
        this.selectedFilesLocales.push(file);
      });
    } else {
      this.selectedFilesLocales = selectedFiles.files;
    }
    this.readURL(this.selectedFilesLocales, this.obtenerFechaHora, this.selectedFilesNames);
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

  removeImageFirebase(image) {
    this.listFilesFirebase = this.listFilesFirebase.filter(file => file.id !== image.id);
    this.selectedFilesDeleteFirabase.push(image);
  }

  removeImage(file) {
    this.selectedFilesLocales = Array.from(this.selectedFilesLocales).filter(fileS => fileS !== file);
    this.selectedFilesNames = Array.from(this.selectedFilesLocales).map(fileS => fileS['idName']);
    this.product.images = this.selectedFilesNames;
  }

  existImages() {
    return this.listFilesFirebase.length > 0 || this.selectedFilesLocales.length > 0;
  }
}

class ImageFirebase {
  constructor(public id?: string, public url?: string) {
  }
}
