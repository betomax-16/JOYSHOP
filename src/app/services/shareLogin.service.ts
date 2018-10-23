import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class ShareLoginService {
    logged: false;
    user = {};

    loggedSource = new BehaviorSubject<boolean>( this.logged );
    userSource = new BehaviorSubject<{}>( this.user );

    constructor() {
    }

    sendLogin( login ) {
        this.loggedSource.next( login );
    }

    sendUser( user ) {
        this.userSource.next( user );
    }
}
