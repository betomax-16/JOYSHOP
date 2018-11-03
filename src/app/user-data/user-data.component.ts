import {Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { MatSnackBar } from '@angular/material';
import { UploadService } from '../services/upload.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
  user: User;
  sexs = [
    {name: 'Hombre', value: 'male'},
    {name: 'Mujer', value: 'female'}
  ];
  // tslint:disable-next-line:max-line-length
  imageUrl = 'https://images.vexels.com/media/users/3/137047/isolated/preview/5831a17a290077c646a48c4db78a81bb-perfil-de-usuario-blue-icon-by-vexels.png';
  constructor(private userService: UserService,
              private uploadService: UploadService,
              private route: ActivatedRoute,
              public notificacionSnackBar: MatSnackBar) {
    this.user = new User();
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        const idUser = params.id;
        this.userService.publicUser(idUser).subscribe(user => {
          this.user = user;
          this.uploadService.getUrl(idUser).subscribe(url => {
            this.imageUrl = url;
          }, error =>  this.showMessage(error.message, 3000));
        }, error => this.showMessage(error.message, 3000));
      }
    );

    // this.userService.getInfo().subscribe(user => {
    //   this.user = user;
    //   this.user.password = '';
    //   this.user.sex = 'male';
    //   this.uploadService.getUrl(this.user._id).subscribe(url => {
    //     this.imageUrl = url;
    //   }, error =>  this.showMessage(error.message, 3000));
    //   console.log(this.user);
    // });
  }

  showMessage(message: string, duration: number) {
    this.notificacionSnackBar.open( message, '', {
      duration: duration,
    } );
  }
}
