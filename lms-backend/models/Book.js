const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true
    },

    author:{
        type:String,
        required:true
    },

    category:{
        type:String,
        required:true
    },

    isbn:{
        type:String,
        required:true,
        unique:true
    },

    quantity:{
        type:Number,
        default:1
    },

   availableCopies: {
    type: Number,
    default: 1
},

    description:{
        type:String,
        default:""
    },

    image:{
        type:String,
        default:""
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Book", bookSchema);