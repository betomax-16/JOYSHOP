import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-modal-recover-password',
  templateUrl: './modal-recover-password.component.html',
  styleUrls: ['./modal-recover-password.component.css']
})
export class ModalRecoverPasswordComponent implements OnInit {
  user: User;

  constructor(public dialogRef: MatDialogRef<ModalRecoverPasswordComponent>,
              public userService: UserService,
              public notificacionSnackBar: MatSnackBar,
              @Inject( MAT_DIALOG_DATA ) public data: any) {
                this.user = new User();
              }

  ngOnInit() {
  }

  recover() {
    this.userService.recoveryPass(this.user).subscribe( res => {
      if (res) {
        console.log(res);
        this.dialogRef.close();
        this.showMessage('Email enviado.', 3000);
      }
    }, err => this.showMessage(err.message, 3000));
  }

  showMessage(message: string, duration: number) {
    this.notificacionSnackBar.open( message, '', {
      duration: duration,
    } );
  }
}
