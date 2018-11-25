import {LocalStorageService} from 'angular-2-local-storage';
import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs';
import {PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {TokenService} from './token.service';
import * as io from 'socket.io-client';


@Injectable()
export class AppSocketIoService {
    private url = 'localhost:4000';
    private socket;

    // Constructor with an injection of ToastService
    constructor(@Inject(PLATFORM_ID) private platformId: Object,
                private tokenService: TokenService,
                private localStorageService: LocalStorageService) {
    }

    reconnect() {
        this.socket.disconnect();
        let payload = '';
        if (isPlatformBrowser(this.platformId)) {
            // Client only code.
            if (this.localStorageService.get('token')) {
                payload = this.tokenService.decodeToken();
                // tslint:disable-next-line:triple-equals
                if (window.location.origin == 'http://localhost:4200') {
                    this.socket = io(this.url, { path: '/napi', query: {idUser: payload.sub} });
                } else {
                    this.socket = io({ path: '/napi', query: {idUser: payload.sub} });
                }
            }
        }

    }

    connect() {
        let payload = '';
        if (isPlatformBrowser(this.platformId)) {
            // Client only code.
            if (this.localStorageService.get('token')) {
                payload = this.tokenService.decodeToken();
                // tslint:disable-next-line:triple-equals
                if (window.location.origin == 'http://localhost:4200') {
                    this.socket = io(this.url, { path: '/napi', query: {idUser: payload.sub} });
                } else {
                    this.socket = io({ path: '/napi', query: {idUser: payload.sub} });
                }
            }
        }
    }

    disconect() {
        this.socket.disconnect();
    }

    sendCommentary(req) {
        this.socket.emit('sendCommentary', req);
    }

    getCommentary() {
        const observable = new Observable(observer => {
            this.socket.on('getCommentary', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    sendAnswer(res) {
        this.socket.emit('sendAnswer', res);
    }

    getAnswer() {
        const observable = new Observable(observer => {
            this.socket.on('getAnswer', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }
}
