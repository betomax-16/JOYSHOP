import {Component, OnInit} from '@angular/core';
import { ShareLoginService } from '../services/shareLogin.service';
import { MatDialog } from '@angular/material';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { ModalRegisterUserComponent } from '../modal-register-user/modal-register-user.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  logged: boolean;

  constructor(public shareLoginService: ShareLoginService,
              public authService: AuthService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.shareLoginService.loggedSource.subscribe(logged => {
      this.logged = this.authService.isAuthenticated();
    });
  }

  login() {
    const dialogRef = this.dialog.open( ModalLoginComponent,
      {
          panelClass: 'modalLogin'
      });

    dialogRef.afterClosed()
      .subscribe( result => {
          console.log(result);
      });
  }

  signup() {
    const dialogRef = this.dialog.open( ModalRegisterUserComponent,
      {
          panelClass: 'modalSignup'
      });

    dialogRef.afterClosed()
      .subscribe( result => {
          console.log(result);
      });
  }
}
