import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageModule } from 'angular-2-local-storage';

import {TransferHttpCacheModule} from '@nguniversal/common';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { ModalLoginComponent } from './modal-login/modal-login.component';
import { ModalRegisterUserComponent } from './modal-register-user/modal-register-user.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { EditUserComponent } from './edit-user/edit-user.component';

// Providers
import { AuthService } from './auth/auth.service';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { NotAuthGuardService as NotAuthGuard } from './auth/notAuth-guard.service';
import { ShareLoginService } from './services/shareLogin.service';
import { UserService } from './services/user.service';
import { UploadService } from './services/upload.service';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    ModalLoginComponent,
    ModalRegisterUserComponent,
    ComingSoonComponent,
    EditUserComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule.withServerTransition({appId: 'my-app'}),
    TransferHttpCacheModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LocalStorageModule.withConfig( {
      prefix: '',
      storageType: 'localStorage'
    }),
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    NotAuthGuard,
    ShareLoginService,
    UserService,
    UploadService
  ],
  entryComponents: [ModalLoginComponent, ModalRegisterUserComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
