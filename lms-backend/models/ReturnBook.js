const mongoose = require("mongoose");


const returnSchema=new mongoose.Schema(

{

issue:{
type:mongoose.Schema.Types.ObjectId,
ref:"IssueBook"
},

returnDate:{
type:Date,
default:Date.now
},

fine:{
type:Number,
default:0
}

},

{timestamps:true}

);




module.exports = mongoose.model("ReturnBook", returnSchema);