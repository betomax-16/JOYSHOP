import { FormatError } from '../models/formarError';
import * as  validator from 'validator';

const moment = require('moment');
const mongoose = require('mongoose');

function filter(queryReq: object, match: object): any {
    // validacion de variables en el query "queryReq"
    for (const key in queryReq) {
        // tslint:disable-next-line:triple-equals
        if (key != 'limit' && key != 'offset' && key != 'fields' && key != 'sort' && key != 'q') {
            const char: string = key.substr(-1);
            switch (char) {
                case '>':
                    if (match.hasOwnProperty(key.substr(0, key.length - 1))) {
                        match[key.substr(0, key.length - 1)]['$gte'] = parseFloat(queryReq[key]);
                    } else {
                        match[key.substr(0, key.length - 1)] = {$gte : parseFloat(queryReq[key])};
                    }
                    break;
                case '<':
                    if (match.hasOwnProperty(key.substr(0, key.length - 1))) {
                        match[key.substr(0, key.length - 1)]['$lte'] = parseFloat(queryReq[key]);
                    } else {
                        match[key.substr(0, key.length - 1)] = {$lte : parseFloat(queryReq[key])};
                    }
                    break;
                case '!':
                    if (match.hasOwnProperty(key.substr(0, key.length - 1))) {
                        match[key.substr(0, key.length - 1)]['$ne'] = queryReq[key];
                    } else {
                        match[key.substr(0, key.length - 1)] = {$ne : queryReq[key]};
                    }
                    break;
                default:
                    if (validator.isMongoId(queryReq[key])) {
                        match[key] = mongoose.Types.ObjectId(queryReq[key]);
                    // tslint:disable-next-line:triple-equals
                    } else if (queryReq[key] == 'true' || queryReq[key] == 'false') {
                        // tslint:disable-next-line:triple-equals
                        match[key] = queryReq[key] == 'true' ? true : false;
                    } else if (queryReq[key].split(',').length > 1) {
                        const options = queryReq[key].split(',');
                        match['$or'] = [];
                        options.forEach(option => {
                            const aux = {};
                            aux[key] = option;
                            match['$or'].push(aux);
                        });
                    } else {
                        if (validator.isDecimal(queryReq[key])) {
                            match[key] = parseFloat(queryReq[key]);
                        } else if (validator.isInt(queryReq[key])) {
                            // tslint:disable-next-line:radix
                            match[key] = parseInt(queryReq[key]);
                        } else {
                            match[key] = queryReq[key];
                        }
                    }
                    break;
            }
        }
    }

    return match;
}

function paginate(queryReq: object, query: any): any {
    if (queryReq.hasOwnProperty('offset')) {
        // tslint:disable-next-line:radix
        if (validator.isInt(queryReq['offset'], [{ allow_leading_zeroes: false }]) && parseInt(queryReq['offset']) >= 0) {
            // tslint:disable-next-line:radix
            query = query.skip(parseInt(queryReq['offset']));
        }
    }
    if (queryReq.hasOwnProperty('limit')) {
        // tslint:disable-next-line:radix
        if (validator.isInt(queryReq['limit'], [{ allow_leading_zeroes: false }]) && parseInt(queryReq['limit']) >= 0) {
            // tslint:disable-next-line:radix
            query = query.limit(parseInt(queryReq['limit']));
        }
    }
    return query;
}

function fields(queryReq: object, query: any): any {
    if (queryReq.hasOwnProperty('fields')) {
        const queryFields: Array<string> = queryReq['fields'].split(',');
        const select: object = {};
        queryFields.forEach(field => {
            select[field] = 1;
        });
        query = query.project(select);
    }
    return query;
}

function sort(queryReq: object, query: any): any {
    if (queryReq.hasOwnProperty('sort')) {
        // obtencion de nombres de los campos que se desean mostrar en el resultado de la consulta
        const queryFields: Array<string> = queryReq['sort'].split(',');
        const select: object = {};
        // por cada campo
        queryFields.forEach(field => {
            // checar si el primer caracter es "-" equivale a "ordenacion descendente"
            // tslint:disable-next-line:triple-equals
            if (field.substr(0, 1) == '-') {
                select[field.substr(1)] = -1;
            // si el primer caracter es " " esto equivale a '+' y por ende una
            // "ordenacion ascendente"
            // tslint:disable-next-line:triple-equals
            } else if (field.substr(0, 1) == ' ') {
                select[field.substr(1)] = 1;
            }
        });
        query = query.sort(select);
    }
    return query;
}

export const UrlQueryService = { filter, paginate, fields, sort };
