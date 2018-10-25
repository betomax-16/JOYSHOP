import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { MatSnackBar } from '@angular/material';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  user: User;
  sexs = [
    {name: 'Hombre', value: 'male'},
    {name: 'Mujer', value: 'female'}
  ];
  @ViewChild('inputFile') myDiv: ElementRef;
  // tslint:disable-next-line:max-line-length
  imageUrl = 'https://images.vexels.com/media/users/3/137047/isolated/preview/5831a17a290077c646a48c4db78a81bb-perfil-de-usuario-blue-icon-by-vexels.png';
  imagePercent = 0;
  mode = 'determinate';
  constructor(private userService: UserService,
              private uploadService: UploadService,
              public notificacionSnackBar: MatSnackBar) {
    this.user = new User();
  }

  ngOnInit() {
    this.userService.getInfo().subscribe(user => {
      this.user = user;
      this.user.password = '';
      this.user.sex = 'male';
      this.uploadService.getUrl(this.user._id).subscribe(url => {
        this.imageUrl = url;
      }, error =>  this.showMessage(error.message, 3000));
      console.log(this.user);
    });
  }

  save() {
    this.userService.editar(this.user).subscribe(userUpdated => {
      this.showMessage('Usuario editado exitosamente.', 3000);
    }, error => this.showMessage(error.message, 3000));
  }

  openFile() {
    const el: HTMLElement = this.myDiv.nativeElement as HTMLElement;
    el.click();
  }

  onChangeFile(fileInput) {
    if (fileInput.target.files.length) {
      const file = fileInput.target.files[0];
      const fileName = file.name;
      if (this.validateImage(file)) {
        this.imagePercent = 1;
        const task = this.uploadService.upload(this.user._id, file);
        task.percentageChanges().subscribe( num => {
          this.imagePercent = num === 100 ? 99 : num;
        });
        task.then( req => {
          this.uploadService.getUrl(this.user._id).subscribe(url => {
            this.imageUrl = url;
            this.imagePercent = 100;
          }, error =>  this.showMessage(error.message, 3000));
        });
      } else {
        this.showMessage('archivo no valido', 3000);
      }
    } else {
      this.showMessage('sin archivos', 3000);
    }
  }

  validateImage(file) {
    const type = file.type;
    const allowedExtensions = /.(gif|jpe?g|png)$/i;
    return allowedExtensions.exec(type);
  }

  showMessage(message: string, duration: number) {
    this.notificacionSnackBar.open( message, '', {
      duration: duration,
    } );
  }

  imagePercentOk() {
    // tslint:disable-next-line:triple-equals
    return this.imagePercent != 0 && this.imagePercent != 100;
  }
}
