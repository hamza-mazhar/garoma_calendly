const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const roles = {
    admin: 'admin',
    customer: 'customer'
};

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        roles: { type: [String], default: [roles.customer] }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);
// validation on the role
UserSchema.methods.isInRole = function (role) {
    for (var i = 0; i < this.roles.length; i++) {
        if (this.roles[i] === role) {
            return true;
        }
    }
    return false;
};

UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("UserSchema", UserSchema);
