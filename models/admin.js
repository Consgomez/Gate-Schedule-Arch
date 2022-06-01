let mongoose = require("mongoose")
let bcrypt = require("bcrypt")
const Schema = mongoose.Schema

const AdminSchema = Schema ({
    email: String,
    password: String,
    position: {
        type: Boolean,
        default: true
    }
})

AdminSchema.methods.comparePassword = function(candidatePassword) {
    const admin = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, admin.password, (err, isMatch) => {
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

module.exports = mongoose.model('admin', AdminSchema)