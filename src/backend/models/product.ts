const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    idUser: { type: Schema.ObjectId, ref: 'Users', required : true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
},
{ timestamps: true });

export const Product = mongoose.model('Products', ProductSchema);
