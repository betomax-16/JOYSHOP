import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ShareLoginService } from './services/shareLogin.service';
import { AuthService } from './auth/auth.service';
import { MatSidenav } from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material';
import { ModalLoginComponent } from './modal-login/modal-login.component';
import { ModalRegisterUserComponent } from './modal-register-user/modal-register-user.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  logged: boolean;
  searchText: string;

  mobileQuery: MediaQueryList;
  @ViewChild('snav') sidenav: MatSidenav;
  private _mobileQueryListener: () => void;

  constructor(public shareLoginService: ShareLoginService,
              public localStorageService: LocalStorageService,
              public authService: AuthService,
              private router: Router,
              public dialog: MatDialog,
              private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher) {
                this.mobileQuery = media.matchMedia('(max-width: 600px)');
                this._mobileQueryListener = () => changeDetectorRef.detectChanges();
                this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.shareLoginService.loggedSource.subscribe(logged => {
      this.logged = this.authService.isAuthenticated();
    });
  }

  logout() {
    this.localStorageService.clearAll();
    this.shareLoginService.sendLogin(false);
    this.shareLoginService.sendUser({});
    this.sidenav.close();
    this.router.navigate(['/']);
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

  search() {

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
