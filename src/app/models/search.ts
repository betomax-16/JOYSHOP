export class Search {
    public 'q': string;
    public 'price': number;
    public 'price>': number;
    public 'price<': number;
    public 'stock': number;
    public 'stock>': number;
    public 'stock<': number;

     constructor(
         q?: string,
         price?: number,
         gtPrice?: number,
         ltPrice?: number,
         stock?: number,
         gtStock?: number,
         ltStock?: number,
     ) {
         if (q) { this.q = q; }
         if (price) { this.price = price; }
         if (gtPrice) { this['price>'] = gtPrice; }
         if (ltPrice) { this['price<'] = ltPrice; }
         if (stock) { this.stock = stock; }
         if (gtStock) { this['stock>'] = gtStock; }
         if (ltStock) { this['stock<'] = ltStock; }
     }
}
