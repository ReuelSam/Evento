const mongoose = require("mongoose");
const uuidv1 = require("uuidv1");
const crypto = require("crypto");
const {ObjectId} = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,             // removes the initial and end spaces
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    hashed_password: {          // never store plain passwords in the database. Therefore we need to hash and encrypt it and then save it
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: true
    },
    salt: String,               // long randomly generated string
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,                // store date of update
    photo: {
        data: Buffer,
        contentType: String
    },
    about: {
        type: String,
        trim: true
    },
    following: [{ type: ObjectId, ref: "User" }],
    followers: [{ type: ObjectId, ref: "User" }],
    attending: [{ type: ObjectId, ref: "Post" }],
    resetPasswordLink : { data: String, default: ""},
    cluster: { type: Number }
});



// virtual field
userSchema.virtual('password')
.set(function(password) {
    // create temporary variable called _password
    this._password = password;
    // generate a timestamp
    this.salt = uuidv1();          // using npm package uuid
    // to encrypt password: encrytPassword()
    this.hashed_password = this.encrytPassword(password); 
})
.get(function(){
    return this._password
})


// methods
userSchema.methods = {
    authenticate: function(plainText){
        return this.encrytPassword(plainText) === this.hashed_password
    },


    encrytPassword: function(password) {
        if(!password) return "";                                // if no password, return empty string
        try {
            return crypto.createHmac('sha1', this.salt)         // nodejs package: crypto -> we use sha1 hashing and salt is used as the key
                    .update(password)
                    .digest('hex');
        } catch (err) {
            return "";                                          // if error, return empty string
        }

    }
};

module.exports = mongoose.model("User", userSchema);