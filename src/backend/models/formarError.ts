export class FormatError {
    field: string;
    message: string;

    constructor(field: string, message: string) {
        this.message = message;
        this.field = field;
    }
}
