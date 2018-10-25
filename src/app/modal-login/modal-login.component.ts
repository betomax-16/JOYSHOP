import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { ShareLoginService } from '../services/shareLogin.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.css']
})
export class ModalLoginComponent implements OnInit {
  user: User;

  constructor(public dialogRef: MatDialogRef<ModalLoginComponent>,
              public shareLoginService: ShareLoginService,
              public localStorageService: LocalStorageService,
              public userService: UserService,
              public notificacionSnackBar: MatSnackBar,
              private router: Router,
              @Inject( MAT_DIALOG_DATA ) public data: any) {
                this.user = new User();
              }

  ngOnInit() {
  }

  login() {
    this.userService.login(this.user).subscribe(res => {
      this.showMessage('Login exitoso.', 2000);
      this.dialogRef.close(res);
      this.localStorageService.set('token', res['token']);
      this.shareLoginService.sendLogin(true);
      this.shareLoginService.sendUser(res['user']);
      this.router.navigate(['comingsoon']);
    }, error => {
      if (error.error.errors) {
        error.error.errors.forEach(err => {
          this.showMessage(err.message, 5000);
        });
      } else {
        this.showMessage(error.error.message, 5000);
      }
    });
  }

  showMessage(message: string, duration: number) {
    this.notificacionSnackBar.open( message, '', {
      duration: duration,
    } );
  }
}
