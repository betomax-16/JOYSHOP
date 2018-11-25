import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { ShareLoginService } from '../services/shareLogin.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-modal-register-user',
  templateUrl: './modal-register-user.component.html',
  styleUrls: ['./modal-register-user.component.css']
})
export class ModalRegisterUserComponent implements OnInit {
  user: User;

  constructor(public dialogRef: MatDialogRef<ModalRegisterUserComponent>,
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

  save() {
    this.userService.registrar(this.user).subscribe(res => {
      this.showMessage('Registro exitoso.', 2000);
      this.dialogRef.close(res);
      this.localStorageService.set('token', res['token']);
      this.shareLoginService.sendLogin(true);
      this.shareLoginService.sendUser(res['user']);
      this.router.navigate(['user/edit']);
    }, error => {
      error.error.errors.forEach(err => {
        this.showMessage(err.message, 5000);
      });
    });
  }

  showMessage(message: string, duration: number) {
    this.notificacionSnackBar.open( message, '', {
      duration: duration,
    } );
  }
}
