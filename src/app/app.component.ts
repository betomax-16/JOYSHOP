import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ShareLoginService } from './services/shareLogin.service';
import { AuthService } from './auth/auth.service';
import { CommentaryService } from './services/commentary.service';
import { MatSidenav } from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material';
import { ModalLoginComponent } from './modal-login/modal-login.component';
import { ModalRegisterUserComponent } from './modal-register-user/modal-register-user.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Commentary } from './models/commentary';
import { ShareCommentariesService } from './services/sharedCommentaries.service';
import { AppSocketIoService } from './services/socketIo.service';
import { UploadService } from './services/upload.service';
const Push = require('push.js');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  logged: boolean;
  searchText: string;
  news: Commentary[];
  mobileQuery: MediaQueryList;
  @ViewChild('snav') sidenav: MatSidenav;
  private _mobileQueryListener: () => void;

  constructor(public shareLoginService: ShareLoginService,
              public shareCommentariesService: ShareCommentariesService,
              public commentaryService: CommentaryService,
              public localStorageService: LocalStorageService,
              public authService: AuthService,
              private router: Router,
              public dialog: MatDialog,
              private SocketIoService: AppSocketIoService,
              private uploadService: UploadService,
              private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher) {
                this.mobileQuery = media.matchMedia('(max-width: 600px)');
                this._mobileQueryListener = () => changeDetectorRef.detectChanges();
                this.mobileQuery.addListener(this._mobileQueryListener);
                this.news = [];
  }

  ngOnInit() {
    this.shareLoginService.loggedSource.subscribe(logged => {
      this.logged = this.authService.isAuthenticated();
      if (this.logged) {
        this.SocketIoService.connect();
        this.SocketIoService.getCommentary().subscribe( commentary => {
          this.news.push(commentary);
          this.shareCommentariesService.sendCommentaries(this.news);
          this.uploadService.getUrl(commentary['idUser']).subscribe(url => {
            Push.create('Nuevo Comentario', {
              body: commentary['user']['name'] + ' ' + commentary['user']['lastname'] + ' comento en: ' + commentary['product']['name'],
              icon: url,
              timeout: 10000,
              onClick: function () {
                window.location.href = 'answer/' + commentary[ '_id' ];
                this.close();
              }
            });
          });
        });
        this.SocketIoService.getAnswer().subscribe( answer => {
          this.news.push(answer);
          this.shareCommentariesService.sendCommentaries(this.news);
          this.uploadService.getUrl(answer['product']['idUser']).subscribe(url => {
            Push.create('Nueva Respuesta', {
              // tslint:disable-next-line:max-line-length
              body: answer['product']['user']['name'] + ' ' + answer['product']['user']['lastname'] + ' respondio en: ' + answer['product']['name'],
              icon: url,
              timeout: 10000,
              onClick: function () {
                window.location.href = 'product/' + answer[ 'idProduct' ];
                this.close();
              }
            });
          });
        });

        this.commentaryService.getNewAnswers().subscribe(answers => {
          this.news = this.news.concat(answers);
          this.commentaryService.getNewCommentaries().subscribe(commentaries => {
            this.news =  this.news.concat(commentaries);
            this.shareCommentariesService.sendCommentaries(this.news);
          });
        });
        this.shareCommentariesService.commentariesSource.subscribe(commentaries => {
          if (commentaries) {
            this.news =  commentaries;
          }
        });
      }
    });
  }

  logout() {
    this.localStorageService.clearAll();
    this.shareLoginService.sendLogin(false);
    this.shareLoginService.sendUser({});
    this.sidenav.close();
    this.SocketIoService.disconect();
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
    this.router.navigate(['search'], { queryParams: { q: this.searchText } });
  }

  existNews() {
    return this.news.length != null && this.news.length > 0;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
