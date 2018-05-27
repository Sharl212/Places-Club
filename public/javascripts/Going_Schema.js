const mongoose = require('mongoose');

let GoingSchema = new mongoose.Schema({
    _creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    _id:{
        type: String,
        required: true
    },
    place: {
        type: String,
        minlength: 1,
        maxlength: 250,
        required: true
    },
    username: {
        type: String,
        minLength: 6
    },
    numberGoing:{
        type:Number,
        required:true,
        // max:,
        default:1
    },
    createdAt:{
        type:String,
        required: true
    }
});

// GoingSchema.methods.toJSON = function () {
//     let goingObject = this.toObject();

//     return _.pick(goingObject, ['_id', 'place', 'username',"createdAt"]);
// };


let GoingStatusSchema = mongoose.model("goingTo", GoingSchema);

module.exports = { GoingStatusSchema };