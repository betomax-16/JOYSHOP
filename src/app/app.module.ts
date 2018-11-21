import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageModule } from 'angular-2-local-storage';

import {TransferHttpCacheModule} from '@nguniversal/common';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng4FilesModule } from './ng4-files';

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
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { UserDataComponent } from './user-data/user-data.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ModalImageComponent } from './modal-image/modal-image.component';
import { ModalFilterComponent } from './modal-filter/modal-filter.component';
import { ListCommentariesComponent } from './list-commentaries/list-commentaries.component';
import { ProductAnswerComponent } from './product-answer/product-answer.component';
import { ModalRecoverPasswordComponent } from './modal-recover-password/modal-recover-password.component';

// Providers
import { AuthService } from './auth/auth.service';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { NotAuthGuardService as NotAuthGuard } from './auth/notAuth-guard.service';
import { ShareLoginService } from './services/shareLogin.service';
import { UserService } from './services/user.service';
import { UploadService } from './services/upload.service';
import { ProductService } from './services/product.service';
import { TokenService } from './services/token.service';
import { CommentaryService } from './services/commentary.service';
import { ShareCommentariesService } from './services/sharedCommentaries.service';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    ModalLoginComponent,
    ModalRegisterUserComponent,
    ComingSoonComponent,
    EditUserComponent,
    ProductListComponent,
    ProductCreateComponent,
    ModalConfirmComponent,
    ProductEditComponent,
    SearchResultsComponent,
    UserDataComponent,
    ProductDetailComponent,
    ModalImageComponent,
    ModalFilterComponent,
    ListCommentariesComponent,
    ProductAnswerComponent,
    ModalRecoverPasswordComponent
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
    Ng4FilesModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    NotAuthGuard,
    ShareLoginService,
    UserService,
    UploadService,
    ProductService,
    TokenService,
    CommentaryService,
    ShareCommentariesService
  ],
  entryComponents: [
    ModalLoginComponent,
    ModalRegisterUserComponent,
    ModalConfirmComponent,
    ModalImageComponent,
    ModalFilterComponent,
    ModalRecoverPasswordComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
