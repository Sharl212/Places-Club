const mongoose = require('mongoose');
const express = require('express');
// const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
// const bcrypt = require('bcrypt');


let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 1,
        maxlength: 20,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 6,
        required: true
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    let userObject = this.toObject();

    return _.pick(userObject, ['_id', 'username', 'password']);
};

UserSchema.methods.generateAuthToken = function () {
    let access = 'auth', // private key
        salt = "mysalt",
        token = jwt.sign({ _id: this._id.toHexString(), access }, salt).toString();

    this.tokens.push({ access, token });
    console.log("logged in!");
    return this.save().then(function () { return token });
};

UserSchema.statics.findByToken = function (token) {
    let decoded;

    try {
        decoded = jwt.verify(token, 'mysalt'); // verify that the token exist.
    } catch (e) {
        return Promise.reject();
    }

    return this.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

UserSchema.statics.findByCredentials = function (username, password) {

    return this.findOne({ username }).then(function (user) {
        if (!user) {
            return Promise.reject();
        }


        // if(password === user.password){
        //     return user;
        // }else{
        //     return('err');
        // }
        return new Promise(function (resolve, reject) {
            console.log('compare is fired');
            if (password === user.password) {
                resolve(user);
                cookie("username", username);

            } else {
                reject();
            }
            // bcrypt.compare(password, user.password, (req, res) => {
            //     if (res) {
            //         resolve(user);
            //     } else {
            //         reject();
            //     }
            // });
        });
    });
};

let SchemaModel = mongoose.model("Users", UserSchema);

module.exports = { SchemaModel };