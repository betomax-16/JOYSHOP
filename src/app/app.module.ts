import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageModule } from 'angular-2-local-storage';

import {TransferHttpCacheModule} from '@nguniversal/common';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { ModalLoginComponent } from './modal-login/modal-login.component';
import { ModalRegisterUserComponent } from './modal-register-user/modal-register-user.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';

// Providers
import { AuthService } from './auth/auth.service';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { NotAuthGuardService as NotAuthGuard } from './auth/notAuth-guard.service';
import { ShareLoginService } from './services/shareLogin.service';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    ModalLoginComponent,
    ModalRegisterUserComponent,
    ComingSoonComponent
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
    })
  ],
  providers: [
    AuthService,
    AuthGuard,
    NotAuthGuard,
    ShareLoginService,
    UserService
  ],
  entryComponents: [ModalLoginComponent, ModalRegisterUserComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
