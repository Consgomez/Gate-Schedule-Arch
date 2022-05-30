let mongoose = require("mongoose")
let bcrypt = require("bcrypt")
const Schema = mongoose.Schema

const UserSchema = Schema ({
    email: String,
    password: String
})

UserSchema.methods.comparePassword = function(candidatePassword) {
    const user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) {
                console.log('error')
                return reject(err);
            }

            if (!isMatch) {
                console.log('no es match')
                return reject(err);
            }

            console.log('andale si')
            resolve(true);
        });
    });
};

module.exports = mongoose.model('users', UserSchema)