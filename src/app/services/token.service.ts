import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
const jwtDecode = require('jwt-decode');

@Injectable({
  providedIn: 'root'
})
export class TokenService {

    constructor(public localStorageService: LocalStorageService) { }

    decodeToken() {
        const token = this.localStorageService.get<string>('token');
        if (token) {
            return jwtDecode(token);
        } else {
            return null;
        }
    }
}
