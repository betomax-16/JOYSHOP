import { User } from './user';
import { Product } from './product';

export class Commentary {
    constructor(
        public _id?: string,
        public idUser?: string,
        public idProduct?: string,
        public comment?: string,
        public viwedPO?: boolean,
        public viwedClient?: boolean,
        public answer?: string,
        public createdAt?: string,
        public updatedAt?: string,
        public user?: User,
        public product?: Product
    ) {}
}
