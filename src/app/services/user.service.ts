import {LocalStorageService} from 'angular-2-local-storage';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../models/user';


@Injectable()
export class UserService {
    usuario: User[];
    private headers: HttpHeaders;

    constructor(private http: HttpClient,
                private localStorageService: LocalStorageService) {

    }

    newHeader() {
        this.headers = new HttpHeaders();
        this.headers = this.headers
                            .set('Content-Type', 'application/json; charset=utf-8')
                            .set('Authorization', this.localStorageService.get('token'));
    }

    login(usuario) {
        return this.http.post('/api/signin', usuario);
    }

    editar(usuario) {
        this.newHeader();
        return this.http.put('/api/user', usuario, {headers: this.headers});
    }

    registrar(usuario) {
        return this.http.post('/api/signup', usuario);
    }


    getInfo() {
        this.newHeader();
        return this.http.get<User>(`/api/user`, {headers: this.headers});
    }

    // Usuarios public
    publicUser(id) {
        return this.http.get<User>(`/api/user/${id}`);

    }
}
