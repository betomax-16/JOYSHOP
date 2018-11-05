import { User } from '../models/user';
import { Product } from '../models/product';
import { FormatError } from '../models/formarError';
import { UrlQueryService } from '../services/urlQueryService';
// import { UrlQueryService } from '../services/urlQueryService';
import * as  validator from 'validator';
const mongoose = require('mongoose');


function validateMongoId(id: string, field: string): FormatError {
  let error: FormatError = null;
  if (!validator.isMongoId(id)) {
      error = new FormatError(field, 'It is not valid Id.');
  }
  return error;
}

function validate(req): FormatError[] {
  let error: FormatError;
  const errors: Array<FormatError> = [];
  const fields: Array<string> = ['name', 'description', 'price', 'stock'];

  fields.forEach(field => {
      if (!req.body[field]) {
          errors.push(new FormatError(field, `The field ${field} can not be empty.`));
      }
  });
  if (req.user) {
      error = validateMongoId(req.user, 'idUser');
      if (error) {
        errors.push(error);
      }
  }

  // tslint:disable-next-line:triple-equals
  if (errors.length == 0) {
    // tslint:disable-next-line:forin
    for (const property in req.body) {
      // tslint:disable-next-line:triple-equals
      if (property == 'name' || property == 'description') {
        // tslint:disable-next-line:triple-equals
        if (typeof req.body[property] == 'string') {
            // tslint:disable-next-line:triple-equals
            if (req.body[property].trim() == '') {
                errors.push(new FormatError(property, `The field ${property} can not be empty.`));
            }
        } else {
            errors.push(new FormatError(property, 'Non-alphabetic format.'));
        }
      // tslint:disable-next-line:triple-equals
      } else if (property == 'price') {
        if (!validator.isDecimal(String(req.body[property]), {decimal_digits: '1,2', locale: 'en-US'})) {
          errors.push(new FormatError(property, 'Incorrect rate format.'));
        } else if (req.body[property] < 0) {
            errors.push(new FormatError(property, 'The rate can not be negative.'));
        }
      // tslint:disable-next-line:triple-equals
      } else if (property == 'stock') {
        if (!validator.isInt(String(req.body[property]))) {
            errors.push(new FormatError(property, 'Incorrect rating format.'));
        }
      }
    }
  }

  return errors;
}

function getProducts(req, res) {
  const idUsuario = req.user;
  const errors: Array<FormatError> = [];
  const errorIdUser: FormatError = validateMongoId(idUsuario, 'idUser');
  if (errorIdUser) { errors.push(errorIdUser); }
  if (errors.length > 0) { return res.status(500).send({errors}); }
  User.findById(idUsuario, (err, usuario) => {
    if (err) { return res.status(500).send({err}); }
    if (!usuario) {
      errors.push(new FormatError('idUser', 'User not found.'));
      return res.status(404).send({errors});
    }
    Product.find({idUser: mongoose.Types.ObjectId(idUsuario)}, (error, products) => {
      if (error) { return res.status(500).send({error}); }
      if (products) {
        return res.status(200).send(products);
      } else {
        errors.push(new FormatError('idUser', 'Products not found.'));
        return res.status(404).send({errors});
      }
    });
  });
}

function getProduct(req, res) {
  const idProduct = req.params.idProduct;
  const idUsuario = req.user;
  const errors: Array<FormatError> = [];
  const errorIdUser: FormatError = validateMongoId(idUsuario, 'idUser');
  const errorIdProduct: FormatError = validateMongoId(idProduct, 'idProduct');
  if (errorIdUser) { errors.push(errorIdUser); }
  if (errorIdProduct) { errors.push(errorIdProduct); }
  if (errors.length > 0) { return res.status(500).send({errors}); }
  User.findById(idUsuario, (err, usuario) => {
    if (err) { return res.status(500).send({err}); }
    if (!usuario) {
      errors.push(new FormatError('idUser', 'User not found.'));
      return res.status(404).send({errors});
    }
    Product.findOne({_id: mongoose.Types.ObjectId(idProduct), idUser: mongoose.Types.ObjectId(idUsuario)}, (error, product) => {
      if (error) { return res.status(500).send({error}); }
      if (product) {
        return res.status(200).send(product);
      } else {
        errors.push(new FormatError('idProduct', 'Product not found.'));
        return res.status(404).send({errors});
      }
    });
  });
}

function getPublicProduct(req, res) {
  const idProduct = req.params.idProduct;
  const errors: Array<FormatError> = [];
  const errorIdProduct: FormatError = validateMongoId(idProduct, 'idProduct');
  if (errorIdProduct) { errors.push(errorIdProduct); }
  if (errors.length > 0) { return res.status(500).send({errors}); }
  Product.findById(idProduct, (error, product) => {
    if (error) { return res.status(500).send({error}); }
    if (product) {
      return res.status(200).send(product);
    } else {
      errors.push(new FormatError('idProduct', 'Product not found.'));
      return res.status(404).send({errors});
    }
  });
}

function createProduct(req, res) {
  const idUsuario = req.user;
  const errors: Array<FormatError> = validate(req);
  if (errors.length > 0) { return res.status(500).send({errors}); }
  Product.findOne({name: req.body.name, idUser: mongoose.Types.ObjectId(idUsuario)}, (err, product) => {
    if (err) { return res.status(500).send({err}); }
    if (!product) {
      const prod = new Product({
        idUser: idUsuario,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        images: req.body.images,
      });

      prod.save((error) => {
        if (error) { return res.status(500).send({error}); }
        return res.status(201).send(prod);
      });
    } else {
      errors.push(new FormatError('name', `Existing product name.`));
      return res.status(500).send({errors});
    }
  });
}

function updateProduct(req, res) {
  const idProduct = req.params.idProduct;
  const idUsuario = req.user;
  const errors: Array<FormatError> = validate(req);
  const errorIdUser: FormatError = validateMongoId(idUsuario, 'idUser');
  const errorIdProduct: FormatError = validateMongoId(idProduct, 'idProduct');
  if (errorIdUser) { errors.push(errorIdUser); }
  if (errorIdProduct) { errors.push(errorIdProduct); }
  if (errors.length > 0) { return res.status(500).send({errors}); }
  User.findById(idUsuario, (err, usuario) => {
    if (err) { return res.status(500).send({err}); }
    if (!usuario) {
        errors.push(new FormatError('idUser', 'User not found.'));
        return res.status(404).send({errors});
    }
    Product.findOne({_id: mongoose.Types.ObjectId(idProduct), idUser: mongoose.Types.ObjectId(idUsuario)}, (error, product) => {
      if (error) { return res.status(500).send({error}); }
      if (product) {
        for (const property in req.body) {
          // tslint:disable-next-line:triple-equals
          if (property != '_id' && property != 'createdAt') {
            product[property] = req.body[property];
          }
        }
        product.save((errorP, updatedProduct) => {
          if (errorP) { return res.status(500).send({errorP}); }
          res.status(200).send(updatedProduct);
        });
      } else {
        errors.push(new FormatError('idProduct', 'Product not found.'));
        return res.status(404).send({errors});
      }
    });
  });
}

function deleteProduct(req, res) {
  const idProduct = req.params.idProduct;
  const idUsuario = req.user;
  const errors: Array<FormatError> = [];
  const errorIdUser: FormatError = validateMongoId(idUsuario, 'idUser');
  const errorIdProduct: FormatError = validateMongoId(idProduct, 'idProduct');
  if (errorIdUser) { errors.push(errorIdUser); }
  if (errorIdProduct) { errors.push(errorIdProduct); }
  if (errors.length > 0) { return res.status(500).send({errors}); }
  User.findById(idUsuario, (err, usuario) => {
    if (err) { return res.status(500).send({err}); }
    if (!usuario) {
        errors.push(new FormatError('idUser', 'User not found.'));
        return res.status(404).send({errors});
    }
    Product.findOne({_id: mongoose.Types.ObjectId(idProduct), idUser: mongoose.Types.ObjectId(idUsuario)}, (error, product) => {
      if (error) { return res.status(500).send({error}); }
      if (product) {
        product.remove((errorP) => {
          if (errorP) { return res.status(500).send({errorP}); }
          return res.status(200).send({message: 'Product deleted.'});
        });
      } else {
        errors.push(new FormatError('idProduct', 'Product not found.'));
        return res.status(404).send({errors});
      }
    });
  });
}

function search(req, res) {
  const searchText = req.query.q;

  let match1 = {};
  if (searchText) {
    // armando expresion regular
    const palabras = searchText.split(' ');
    let aux = '';
    palabras.forEach(palabra => {
        aux += `${palabra}|`;
    });
    aux = aux.substring(0, aux.length - 1);
    aux = `(${aux})`;

    // creando condicion principal de filtrado
    match1 = { $or: [ { name: new RegExp(aux, 'i') }, { description: new RegExp(aux, 'i') } ] };
  }

  const lookup = { from: 'users', localField: 'idUser', foreignField: '_id', as: 'user' };

  // creando condicion de filtrado para el join (lookup)
  const match2 = { user: { $ne: [] } };
  // Agregar filtros
  match1 = UrlQueryService.filter(req.query, match1);
  const unwind = { $unwind : '$user' };

  // creando estructura del query
  let query;
  query = Product.aggregate([
    { $match: match1 },
    { $lookup: lookup },
    { $match: match2 },
    unwind
  ]);

  // Agregar caracterristicas de paginacion
  query = UrlQueryService.paginate(req.query, query);
  // Agregar caracterristicas de seleccion de campos
  query = UrlQueryService.fields(req.query, query);
  // Agregar caracterristicas de ordenamiento
  query = UrlQueryService.sort(req.query, query);

  query.exec().then(
      products => {
        query = Product.aggregate([
          {$match: match1},
          {$lookup: lookup},
          {$match: match2},
          {$count: 'count'}
        ]);
        // query.append({$count:'count'});
        query.exec().then(
            response => {
                if (response.length) {
                    return res.status(200).send({products, count: response[0]['count']});
                }
                return res.status(200).send({products, count: response.length});
            },
            err => res.status(500).send({err})
        );
      },
      err => res.status(500).send({err})
  );
}

export const ProductoCtrl = {
  getProducts,
  getProduct,
  getPublicProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  search
};
