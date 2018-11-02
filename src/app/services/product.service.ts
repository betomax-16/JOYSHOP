import {LocalStorageService} from 'angular-2-local-storage';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Product} from '../models/product';


@Injectable()
export class ProductService {
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

    getProducts() {
        this.newHeader();
        return this.http.get<Product[]>('/api/product', {headers: this.headers});
    }

    getProduct(id) {
        this.newHeader();
        return this.http.get<Product>(`/api/product/${id}`, {headers: this.headers});
    }

    insert(product: Product) {
        this.newHeader();
        return this.http.post(`/api/product`, product, {headers: this.headers});
    }

    update(product: Product) {
        this.newHeader();
        return this.http.put(`/api/product/${product._id}`, product, {headers: this.headers});
    }

    remove(product: Product) {
        this.newHeader();
        return this.http.delete(`/api/product/${product._id}`, {headers: this.headers});
    }


    search(params) {
        let httpParams = new HttpParams();

        // tslint:disable-next-line:forin
        for (const key in params) {
            httpParams = httpParams.set(String(key), String(params[key]));
        }

        return this.http.get<Product[]>('/api/search', {params: httpParams});
    }

}
