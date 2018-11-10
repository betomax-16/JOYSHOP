import { FormatError } from '../models/formarError';
import { Commentary } from '../models/commentary';
import * as  validator from 'validator';
const mongoose = require('mongoose');


function validateMongoId(id: string, field: string): FormatError {
  let error: FormatError = null;
  if (!validator.isMongoId(id)) {
      error = new FormatError(field, 'It is not valid Id.');
  }
  return error;
}

function validate(req, update?): FormatError[] {
  let error: FormatError;
  const errors: Array<FormatError> = [];
  const fields: Array<string> = ['comment'];

  if (!update) {
    fields.forEach(field => {
        if (!req.body[field]) {
            errors.push(new FormatError(field, `The field ${field} can not be empty.`));
        }
    });
  }
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
      if (property == 'answer' || property == 'comment') {
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
      } else if (property == 'viwedPO' || property == 'viwedClient') {
        // tslint:disable-next-line:triple-equals
        if (typeof req.body[property] != 'boolean') {
            errors.push(new FormatError(property, 'Is not a boolean.'));
        }
      // tslint:disable-next-line:triple-equals
      } else if (property == 'idProduct') {
            error = validateMongoId(req.body[property], property);
            if (error) {
                errors.push(error);
            }
      }
    }
  }

  return errors;
}

function getCommentariesByProduct(req, res) {
  const idProduct = req.params.idProduct;
  const errors: Array<FormatError> = [];
  const errorIdProduct: FormatError = validateMongoId(idProduct, 'idProduct');
  if (errorIdProduct) { errors.push(errorIdProduct); }
  if (errors.length > 0) { return res.status(500).send({errors}); }
  Commentary.find({idProduct: mongoose.Types.ObjectId(idProduct)}, (error, commentaries) => {
    if (error) { return res.status(500).send({error}); }
    if (!commentaries) {
        errors.push(new FormatError('idProduct', 'Commentaries not found.'));
        return res.status(404).send({errors});
    } else {
        return res.status(200).send(commentaries);
    }
  });
}

function getNewCommentaries(req, res) {
  const idUsuario = req.user;
  const errors: Array<FormatError> = [];
  const errorIdUser: FormatError = validateMongoId(idUsuario, 'idUser');
  if (errorIdUser) { errors.push(errorIdUser); }
  if (errors.length > 0) { return res.status(500).send({errors}); }

  let query;
  query = Commentary.aggregate([
    {
        $lookup:
           {
             from: 'products',
             localField: 'idProduct',
             foreignField: '_id',
             as: 'product'
           }
    },
    { $unwind : '$product' },
    { $match : { 'product.idUser': mongoose.Types.ObjectId(idUsuario), viwedPO: false } },
    {
        $lookup:
           {
             from: 'users',
             localField: 'product.idUser',
             foreignField: '_id',
             as: 'product.user'
           }
    },
    { $unwind : '$product.user' },
    {
        $lookup:
           {
             from: 'users',
             localField: 'idUser',
             foreignField: '_id',
             as: 'user'
           }
    },
    { $unwind : '$user' }
  ]);

  query.exec().then(
    commentaries => {
        return res.status(200).send(commentaries);
    },
    err => res.status(500).send({err})
  );
}

function getNewAnswers(req, res) {
  const idUsuario = req.user;
  const errors: Array<FormatError> = [];
  const errorIdUser: FormatError = validateMongoId(idUsuario, 'idUser');
  if (errorIdUser) { errors.push(errorIdUser); }
  if (errors.length > 0) { return res.status(500).send({errors}); }

  let query;
  query = Commentary.aggregate([
    {
        $lookup:
           {
             from: 'products',
             localField: 'idProduct',
             foreignField: '_id',
             as: 'product'
           }
    },
    { $unwind : '$product' },
    { $match : { idUser: mongoose.Types.ObjectId(idUsuario), viwedClient: false } },
    {
        $lookup:
           {
             from: 'users',
             localField: 'product.idUser',
             foreignField: '_id',
             as: 'product.user'
           }
    },
    { $unwind : '$product.user' },
    {
        $lookup:
           {
             from: 'users',
             localField: 'idUser',
             foreignField: '_id',
             as: 'user'
           }
    },
    { $unwind : '$user' }
  ]);

  query.exec().then(
    commentaries => {
        return res.status(200).send(commentaries);
    },
    err => res.status(500).send({err})
  );
}

function createCommentary(req, res) {
  const idUsuario = req.user;
  const idProduct = req.params.idProduct;
  const errors: Array<FormatError> = validate(req);
  const errorIdProduct: FormatError = validateMongoId(idProduct, 'idProduct');
  if (errorIdProduct) { errors.push(errorIdProduct); }
  if (errors.length > 0) { return res.status(500).send({errors}); }

  const commentary = new Commentary({
    idUser: idUsuario,
    idProduct: idProduct,
    comment: req.body.comment
  });

  commentary.save(error => {
    if (error) { return res.status(500).send({error}); }
    return res.status(201).send(commentary);
  });
}

function updateCommentary(req, res) {
    const idUsuario = req.user;
    const idCommentary = req.params.idCommentary;
    const errors: Array<FormatError> = validate(req, true);
    const errorIdCommentary: FormatError = validateMongoId(idCommentary, 'idCommentary');
    if (errorIdCommentary) { errors.push(errorIdCommentary); }
    if (errors.length > 0) { return res.status(500).send({errors}); }

    Commentary.findById(idCommentary, (err, commentary) => {
        if (err) { return res.status(500).send({err}); }
        if (!commentary) {
            errors.push(new FormatError('idCommentary', 'Commentary not found.'));
            return res.status(404).send({errors});
        } else {
            for (const property in req.body) {
                // tslint:disable-next-line:triple-equals
                if (property != '_id' && property != 'createdAt') {
                    commentary[property] = req.body[property];
                }
            }
            commentary.save((error, updatedCommentary) => {
                if (error) { return res.status(500).send({error}); }
                res.status(200).send(updatedCommentary);
            });
        }
    });
}

export const CommentaryCtrl = {
    getCommentariesByProduct,
    getNewCommentaries,
    createCommentary,
    updateCommentary,
    getNewAnswers
};
