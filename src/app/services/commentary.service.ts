import {LocalStorageService} from 'angular-2-local-storage';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Commentary } from '../models/commentary';

@Injectable()
export class CommentaryService {
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

    getCommentary(idCommentary) {
        return this.http.get<Commentary>(`/api/commentary/${idCommentary}`);
    }

    getCommentariesByProduct(idProduct) {
        return this.http.get<Commentary[]>(`/api/product/${idProduct}/commentary`);
    }

    getNewCommentaries() {
        this.newHeader();
        return this.http.get<Commentary[]>(`/api/new/commentary`, {headers: this.headers});
    }

    getNewAnswers() {
        this.newHeader();
        return this.http.get<Commentary[]>(`/api/new/answer`, {headers: this.headers});
    }

    create(commentary: Commentary) {
        this.newHeader();
        return this.http.post<Commentary>(`/api/product/${commentary.idProduct}/commentary`, commentary, {headers: this.headers});
    }

    update(commentary: Commentary) {
        this.newHeader();
        return this.http.put<Commentary>(`/api/commentary/${commentary._id}`, commentary, {headers: this.headers});
    }

    getCommentariesWithoutAnswer() {
        this.newHeader();
        return this.http.get<Commentary[]>(`/api/new/commentary/withoutanswer`, {headers: this.headers});
    }

    getOldAnswers() {
        this.newHeader();
        return this.http.get<Commentary[]>(`/api/old/answer`, {headers: this.headers});
    }
}
