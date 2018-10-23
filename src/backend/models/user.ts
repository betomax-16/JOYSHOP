const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String },
    email: { type: String, unique: true, required: true },
    sex: { type: String, enum: ['male', 'female'] },
    password: { type: String, required: true },
    birthdate: { type: Date },
    photo: { type: String },
    confirm: { type: Boolean, default: false }
},
{ timestamps: true });

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.password) { return next(); }
  if (!user.isModified('password')) { return next(); }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, null, (error, hash) => {
      if (error) { return next(error); }
      user.password = hash;
      next();
    });
  });
});

UserSchema.pre('findOneAndUpdate', function (next) {
    const user = this.getUpdate();
    if (!user) {
      return next();
    } else if (!user.password) {
        return next();
    // tslint:disable-next-line:triple-equals
    } else if (user.password && user.password == '') {
        delete user.password;
        return next();
    }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, null, (error, hash) => {
      if (error) { return next(error); }

      user.password = hash;
      next();
    });
  });
});

export const User = mongoose.model('Users', UserSchema);
