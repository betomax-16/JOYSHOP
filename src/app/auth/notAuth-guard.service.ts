import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { log } from 'util';

@Injectable()
export class NotAuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(): boolean {
      if (this.auth.isAuthenticated()) {
        // this.router.navigate(['perfil']);
        console.log('pagina solo para personas no autenticadas');
        return false;
      } else { return true; }
  }
}
