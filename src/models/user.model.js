const mongoose = require('mongoose');

let validateEmail = function(email) {
//expression régulière
let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
return re.test(email)
};

const userSchema = new mongoose.Schema({
        username:{
            type: String,
            required: true,
        },
        email: {type: String,
            required: true,
            unique: true,
            //seul ça est nouveau
            validate: [validateEmail, 'Please fill a valid email address']
            },
        role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
        password: String
    });
    userSchema.pre('save', function(next){
        if (this.username) {
        this.username = this.username[0].toUpperCase() + this.username.slice(1).toLowerCase();
    }
});
const userModel = mongoose.model('Users', userSchema);

module.exports = userModel