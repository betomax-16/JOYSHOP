export class User {
    constructor(
        public name?: string,
        public lastname?: string,
        public phone?: string,
        public email?: string,
        public sex?: string,
        public password?: string,
        public birthdate?: Date,
        public createdAt?: Date,
        public photo?: string,
        public confirm?: boolean
    ) {}
}
