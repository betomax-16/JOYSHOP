import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {TransferHttpCacheModule} from '@nguniversal/common';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { ModalLoginComponent } from './modal-login/modal-login.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    ModalLoginComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule.withServerTransition({appId: 'my-app'}),
    TransferHttpCacheModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [],
  entryComponents: [ModalLoginComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
