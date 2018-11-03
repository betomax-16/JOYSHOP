import { User } from './user';

export class Product {
    constructor(
        public _id?: string,
        public idUser?: string,
        public name?: string,
        public description?: string,
        public price?: number,
        public stock?: number,
        public createdAt?: string,
        public updatedAt?: string,
        public user?: User,
        public images?: string[],
        public imagesFiles?: File[]
    ) {}
}
