const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentarySchema = new Schema({
    idUser: { type: Schema.ObjectId, ref: 'Users', required : true },
    idProduct: { type: Schema.ObjectId, ref: 'Products', required : true },
    comment: { type: String, required: true },
    viwedPO: { type: Boolean, default: false, required: true },
    viwedClient: { type: Boolean, default: false, required: true },
    answer: { type: String }
},
{ timestamps: true });

export const Commentary = mongoose.model('Comments', CommentarySchema);
