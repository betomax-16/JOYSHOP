import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import * as moment from 'moment';
const jwtDecode = require('jwt-decode');

@Injectable()
export class AuthService {
  constructor(public localStorageService: LocalStorageService) {}

  public isAuthenticated(): boolean {
    const token = this.localStorageService.get<string>('token');
    if (token) {
        return !this.isTokenExpired(token);
    }
    return false;
  }

  public isTokenExpired(token: string): boolean {
    try {
        const payload = jwtDecode(token);
        return payload.exp <= moment().unix();
      } catch (e) {
        return false;
      }
  }
}
