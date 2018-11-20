import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { NotAuthGuardService as NotAuthGuard } from './auth/notAuth-guard.service';

/*Components App Import*/
import { HomeComponent } from './home/home.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { UserDataComponent } from './user-data/user-data.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ListCommentariesComponent } from './list-commentaries/list-commentaries.component';
import { ProductAnswerComponent } from './product-answer/product-answer.component';

const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full'},
    { path: 'user/edit', component: EditUserComponent, canActivate: [AuthGuard] },
    { path: 'user/products', component: ProductListComponent, canActivate: [AuthGuard] },
    { path: 'user/products/new', component: ProductCreateComponent, canActivate: [AuthGuard] },
    { path: 'user/products/edit/:id', component: ProductEditComponent, canActivate: [AuthGuard] },
    { path: 'search', component: SearchResultsComponent },
    { path: 'artist/:id', component: UserDataComponent },
    { path: 'product/:id', component: ProductDetailComponent },
    { path: 'commentary', component: ListCommentariesComponent, canActivate: [AuthGuard] },
    { path: 'answer/:id', component: ProductAnswerComponent, canActivate: [AuthGuard] },
    { path: 'comingsoon', component: ComingSoonComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
  ];

  @NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
  })
  export class AppRoutingModule {}
